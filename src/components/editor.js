import { debounce } from "../utils/debounce.js";
import { getDocument, updateDocument } from "../api/documentApi.js";

export async function initEditor({ mount, docId }) {
  if (!mount) throw new Error("에디터에 마운트할 DOM 요소가 필요합니다.");

  const state = { title: "", content: "" };

  // 에디터 컨테이너
  const editorContainer = document.createElement("div");
  editorContainer.className = "editor";

  // 제목 입력창
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

  const saveDebounced = debounce(async () => {
    try {
      await updateDocument(docId, state);
      status.textContent = "저장 완료";
    } catch (e) {
      status.textContent = "저장 실패";
      console.error("저장 에러: ", e);
    }
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

  try {
    const doc = await getDocument(docId);
    console.log(doc);
    state.title = doc.title ?? "";
    state.content = doc.content ?? "";
    titleInput.value = state.title;
    contentTextarea.value = state.content;
  } catch (e) {
    console.error("문서 불러오기 실패: ", e);
  }

  // DOM 연결 파트
  editorContainer.append(titleInput, contentTextarea, status);
  mount.appendChild(editorContainer);
}
