import { debounce } from "../utils/debounce.js";

export function initEditor({ mount }) {
  if (!mount) throw new Error("에디터에 마운트할 DOM 요소가 필요합니다.");

  const state = { title: "", content: "" };

  // 에디터 컨테이너
  const editorContainer = document.createElement("div");
  editorContainer.className = "editor";

  // 제목 입려창
  const titleInput = document.createElement("input");
  titleInput.className = "editor__title";
  titleInput.type = "text";
  titleInput.placeholder = "새 페이지";

  // 컨텐츠 입력 영역
  const contentTextarea = document.createElement("textarea");
  contentTextarea.className = "editor__content";
  contentTextarea.placeholder = "내용을 입력하세요";

  // 디바운스 컨텐츠 상태
  const status = document.createElement("span");
  status.className = "editor__status";

  const saveDebounced = debounce(() => {
    console.log("저장됨");
    status.textContent = "저장 완료";
  }, 1000);

  // 이벤트 연결
  titleInput.addEventListener("input", () => {
    state.title = titleInput.value;
    status.textContent = "저장중...";
    saveDebounced();
  });
  contentTextarea.addEventListener("input", () => {
    state.content = contentTextarea.value;
    status.textContent = "저장중...";
    saveDebounced();
  });

  // DOM 연결 파트
  editorContainer.append(titleInput, contentTextarea, status);
  mount.appendChild(editorContainer);
}
