import { addRootDoc, createDocumentItem } from "./documentManager.js";
import { getRootDocuments } from "../api/documentAPI.js";
import { initEditor } from "./editor.js";

// === [라우팅 로직] ===
export function route() {
  const mountPoint = document.getElementById("editor-mount-point");
  // 에디터 마운트 지점 초기화
  mountPoint.innerHTML = "";

  const { pathname } = window.location;

  if (pathname === "/") {
    // 루트 URL일 경우 플레이스홀더 표시
    mountPoint.innerHTML = `<div class="placeholder">
      <p>+ 버튼을 눌러 새 페이지를 만드세요.</p>
    </div>`;
    return;
  }

  const documentMatch = pathname.match(/^\/documents\/(.+)$/);
  if (documentMatch) {
    const documentId = documentMatch[1];
    initEditor({ mount: mountPoint, docId: documentId });
    return;
  }
}

// === [SPA 네비게이션] ===
export function navigate(path) {
  history.pushState(null, "", path);
  route();
}
window.navigate = navigate;

// === [문서 목록 생성] ===
export const createRootDocumentsList = async () => {
  const list = document.getElementById("document-list");
  if (!list) return;
  list.innerHTML = "";

  try {
    const docs = await getRootDocuments();
    for (const doc of docs) {
      await createDocumentItem(doc, list);
    }
  } catch (err) {
    console.error("문서 목록 가져오기 실패:", err);
  }
};

// === [이벤트 리스너 등록 및 초기화] ===
window.addEventListener("DOMContentLoaded", async () => {
  // 사이드바 렌더링 및 SPA 라우팅 초기화
  await createRootDocumentsList();
  route();

  // + 새 페이지 버튼 (중복 방지)
  const addRootBtn = document.getElementById("add-root-doc-btn");
  if (addRootBtn && !addRootBtn.dataset.listenerAdded) {
    addRootBtn.addEventListener("click", async () => {
      await addRootDoc(); // 생성 후 navigate 포함
    });
    addRootBtn.dataset.listenerAdded = "true";
  }
});

// 브라우저 뒤로가기/앞으로가기
window.addEventListener("popstate", route);
