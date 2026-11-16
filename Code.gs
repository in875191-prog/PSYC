/**
 * 사랑의 삼각형 검사 → 해석자 메일 보내기 (Google Apps Script)
 *
 * GitHub Pages는 메일을 직접 못 보내서, 검사 페이지가 만든 PDF를 이 스크립트로 보내고
 * 이 스크립트가 해석자 메일로 첨부해서 보내 줌.
 * 설치 방법은 README.md의 "해석자 메일 설정" 참고.
 */

// ▼ 여기만 바꾸면 됨 ▼
// 해석 가이드를 받을 해석자 메일. 여러 명이면 쉼표로: "a@gmail.com,b@gmail.com"
var TO = "interpreter@example.com";
// 메일 보낸 사람 이름으로 보이는 글자
var SENDER_NAME = "사랑의 삼각형 검사";
// ▲ 여기까지 ▲

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);
    // 이상한 요청 거르기
    if (!d || !d.pdf || !/^[0-9A-Z]{4}$/.test(String(d.rid || ""))) return out({ ok: false, error: "bad request" });
    var bytes = Utilities.base64Decode(d.pdf);
    if (bytes.length > 15 * 1024 * 1024) return out({ ok: false, error: "too large" });
    if (String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) !== "%PDF") return out({ ok: false, error: "not pdf" });

    var name = "사랑의삼각형_" + d.rid + ".pdf";
    var pdf = Utilities.newBlob(bytes, "application/pdf", name);
    var subject = String(d.subject || ("[사랑의 삼각형] 접수 " + d.rid)).slice(0, 120);

    MailApp.sendEmail({
      to: TO,
      subject: subject,
      body: String(d.text || "").slice(0, 5000),
      htmlBody: String(d.html || "").slice(0, 20000),
      name: SENDER_NAME,
      attachments: [pdf]
    });
    return out({ ok: true, left: MailApp.getRemainingDailyQuota() });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// 브라우저 주소창에서 웹 앱 URL을 열면 작동하는지 확인할 수 있음
function doGet() {
  return out({ ok: true, msg: "작동 중", left: MailApp.getRemainingDailyQuota() });
}

// 배포 전에 편집기에서 이 함수를 한 번 실행하면 메일 권한을 허락하는 창이 뜸 + 테스트 메일 감
function test() {
  MailApp.sendEmail(TO, "[사랑의 삼각형] 테스트 메일", "이 메일이 왔다면 설정이 끝난 거예요. 오늘 남은 발송 횟수: " + MailApp.getRemainingDailyQuota());
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
