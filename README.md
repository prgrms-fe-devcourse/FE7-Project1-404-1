# FE7-Project1-404-1

## 주요 기능

### 1. 문서 관리
- 루트 문서 생성
- 하위 문서 생성
- 문서 제목 및 내용 수정
- 실시간 자동 저장 (디바운싱 적용)

### 2. 페이지 네비게이션
- History API를 활용한 SPA 라우팅 구현
- 사이드바를 통한 문서 목록 표시
- 사이드바 토글 기능

<br>

## 기술 스택
- Vaniila JavaScript
- HTML5
- CSS

<br>

## 🧾 커밋 메시지 규칙 (이모지 + 한글)

```
<emoji> <type>: <짧은 설명> (선택: #이슈번호)
```

- ✨ feat: 사용자 기능 추가
    
- 🐛 fix: 버그 수정
    
- 🧰 chore: 설정/빌드/보일러플레이트
    
- 🎨 style: 코드 스타일(동작 무관)
    
- 🧼 refactor: 리팩토링
    
- 📝 docs: 문서 변경
    
- ✅ test: 테스트

<br>

## 🗂️ 이슈 & PR 규칙

- 이슈 템플릿(요약/작업 내용/예상 결과/스크린샷/체크리스트)
    
- PR 템플릿(작업 내용/작동 방식/확인 사항/스크린샷)
    
- PR 제목: [Feature] ..., [Fix] ..., [Chore] ...
    
- 본문 끝에 Closes #이슈번호로 자동 종료 연결

<br>

## 🔌 API 사용 규칙

- 모든 요청 헤더 포함:    

```
x-username: <고유 이름>
Content-Type: application/json
```
    
- 엔드포인트
    
    - GET /documents : 루트 트리
        
    - GET /documents/:id : 단건 조회
        
    - POST /documents : 생성 { title, parent }
        
    - PUT /documents/:id : 수정 { title, content }
        
    - DELETE /documents/:id : 삭제
