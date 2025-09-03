import { getRootDocuments } from "../api/documents.js";
import { createDocumentItem } from "./documentManager/createDocumentItems.js";
import { initEditor } from "./editor.js";
// 각 문서 - 아이디(숫자)/제목(문자열)/자식목록(배열)
function renderDocuments(docs) {
  let html = `<ul>`;

  for (const doc of docs) {
    html += `<li data-id="${doc.id}">${doc.title}<button id="add">+</button><button id="del">🗑️</button></li>`;

    if (doc.documents.length > 0) {
      html += renderDocuments(doc.documents);
    }
  }
  html += `</ul>`;
  return html;
}

export async function render() {
  const docs = await getRootDocuments();
  const list = document.querySelector("body");
  list.innerHTML = renderDocuments(docs);

  document.querySelector("#sidebar").addEventListener("click", (e) => {
    if (e.target.tagName === "LI" || e.target.closest("li")) {
      const li = e.target.tagName === "LI" ? e.target : e.target.closest("li");
      const docId = li.dataset.id;
      navigate(`/documents/${docId}`);
    }
  });
}

export function navigate(path) {
  history.pushState(null, null, path);
  route();
}

export function route() {
  const mountPoint = document.querySelector("#editor");
  const id = handleRoute();
  if (id) {
    initEditor({ mount: mountPoint, docId: id });
  }
}

function handleRoute() {
  const path = window.location.pathname;
  return path.split("/").pop();
}

window.addEventListener("popstate", handleRoute);

render();
