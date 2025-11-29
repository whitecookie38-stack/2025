
# 구글 스프레드시트 서버 설정 가이드

이 웹사이트는 데이터를 저장하기 위해 구글 스프레드시트와 Apps Script를 사용합니다.
다음 순서를 따라 데이터베이스를 설정하세요.

### 1단계: 시트 생성
1. [Google Sheets](https://sheets.google.com)로 이동하여 새 스프레드시트를 만듭니다.
2. 시트 이름을 "CoC Character DB" 등으로 지정합니다.

### 2단계: 앱스 스크립트 작성
1. 스프레드시트 메뉴에서 **확장 프로그램 (Extensions) > Apps Script**를 클릭합니다.
2. `Code.gs` 파일의 내용을 모두 지우고 아래 코드를 복사해서 붙여넣습니다.

```javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const action = e.parameter.action;

  // action=list 일 때 모든 캐릭터 데이터 반환
  if (action === 'list') {
    const items = [];
    for (let i = 0; i < rows.length; i++) {
      const jsonStr = rows[i][0]; // A열의 데이터를 읽음
      // 데이터가 있고 JSON 형식({로 시작)인 경우만 파싱
      if (jsonStr && jsonStr.toString().trim().startsWith('{')) {
        try {
            items.push(JSON.parse(jsonStr));
        } catch(err) {
            // 파싱 실패한 행은 무시
        }
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ items: items }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  // 동시 접속 충돌 방지 (Lock)
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    // React에서 보낸 데이터 파싱
    const payload = JSON.parse(e.postData.contents);
    
    if (payload.action === 'save') {
      const newChar = payload.data;
      const data = sheet.getDataRange().getValues();
      let rowIndex = -1;

      // 이미 저장된 캐릭터인지 ID로 확인 (수정 모드)
      for (let i = 0; i < data.length; i++) {
        const jsonStr = data[i][0];
        if (jsonStr && jsonStr.toString().trim().startsWith('{')) {
           try {
             const existing = JSON.parse(jsonStr);
             if (existing.id === newChar.id) {
               rowIndex = i + 1; // 행 번호는 1부터 시작
               break;
             }
           } catch(e) {}
        }
      }

      const jsonString = JSON.stringify(newChar);

      if (rowIndex !== -1) {
        // 기존 행 업데이트
        sheet.getRange(rowIndex, 1).setValue(jsonString);
      } else {
        // 새로운 행 추가
        sheet.appendRow([jsonString]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
        .setMimeType(ContentService.MimeType.JSON);

    } else if (payload.action === 'delete') {
      const idToDelete = payload.id;
      const data = sheet.getDataRange().getValues();
      
      for (let i = 0; i < data.length; i++) {
         const jsonStr = data[i][0];
         if (jsonStr && jsonStr.toString().trim().startsWith('{')) {
             try {
                const existing = JSON.parse(jsonStr);
                if (existing.id === idToDelete) {
                    sheet.deleteRow(i + 1);
                    return ContentService.createTextOutput(JSON.stringify({ result: 'deleted' }))
                        .setMimeType(ContentService.MimeType.JSON);
                }
             } catch(e) {}
         }
      }
      return ContentService.createTextOutput(JSON.stringify({ result: 'not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

### 3단계: 배포 (Deployment)
1. Apps Script 화면 우측 상단의 **배포 (Deploy) > 새 배포 (New deployment)**를 클릭합니다.
2. '유형 선택' 톱니바퀴를 눌러 **웹 앱 (Web app)**을 선택합니다.
3. 설정:
   - **설명**: CoC Server (원하는 대로)
   - **다음 사용자로 실행**: **나(Me)** (중요!)
   - **액세스 권한이 있는 사용자**: **모든 사용자 (Anyone)** (중요!)
4. **배포 (Deploy)** 버튼을 클릭합니다.
5. 권한 승인 창이 뜨면 **권한 검토 > 계정 선택 > 고급 > (안전하지 않음)으로 이동 > 허용** 과정을 거칩니다.
6. **웹 앱 URL**이 생성됩니다. 이 주소를 복사하여 대시보드에 입력하세요.
