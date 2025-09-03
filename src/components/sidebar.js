import { getRootDocuments } from "../api/documentAPI.js";
import { createDocumentItem } from "./documentManager.js";
import { initEditor } from "./editor.js";

// === [라우팅 로직] ===
function handleRoute() {
  const path = window.location.pathname;
  return path.split("/").pop();
}

export function route() {
  const mountPoint = document.querySelector("#editor");
  const id = handleRoute();
  if (id) {
    initEditor({ mount: mountPoint, docId: id });
  }
}

export function navigate(path) {
  history.pushState(null, null, path);
  route();
}

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

export async function render() {
  await createRootDocumentsList();
  route();
}

// === [이벤트 바인딩] ===
window.addEventListener("DOMContentLoaded", render);
window.addEventListener("popstate", route);
