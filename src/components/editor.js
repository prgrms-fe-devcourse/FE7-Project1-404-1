export function initEditor({ mount }) {
  if (!mount) throw new Error("에디터에 마운트할 DOM 요소가 필요합니다.");

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

  editorContainer.appendChild(titleInput);
  editorContainer.appendChild(contentTextarea);

  mount.appendChild(editorContainer);
}
