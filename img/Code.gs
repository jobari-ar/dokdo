/**
 * 독도의 날 포토존 - Google Apps Script 백엔드
 * 배포: 배포 > 새 배포 > 유형 "웹 앱"
 *   - 다음 사용자로 실행: 나
 *   - 액세스 권한: 모든 사용자
 * 배포 후 받은 웹 앱 URL(.../exec)을 index.html의 GAS_URL에 붙여넣으세요.
 */

// ▼▼▼ 사진을 저장할 구글 드라이브 폴더 ID (폴더 URL의 /folders/ 뒤 문자열) ▼▼▼
var FOLDER_ID = '여기에_폴더_ID를_입력하세요';
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var student = String(data.student || '').trim();
    if (!student) throw new Error('학번/이름이 비어 있습니다.');
    if (!data.image) throw new Error('이미지 데이터가 없습니다.');

    // 파일명에 쓸 수 없는 문자 제거, 공백은 언더바로
    var safeName = student.replace(/[\\\/:*?"<>|]/g, '').replace(/\s+/g, '_');
    var stamp = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyyMMdd_HHmmss');
    var fileName = safeName + '_' + stamp + '.jpg';

    var base64 = data.image.split(',').pop();
    var blob = Utilities.newBlob(Utilities.base64Decode(base64), 'image/jpeg', fileName);
    var file = DriveApp.getFolderById(FOLDER_ID).createFile(blob);

    return json({ ok: true, fileName: fileName, id: file.getId() });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doGet() {
  return json({ ok: true, message: '독도의 날 포토존 서버 동작 중' });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// 최초 1회 실행하여 드라이브 권한을 승인하세요.
function authorize() {
  Logger.log(DriveApp.getFolderById(FOLDER_ID).getName());
}
