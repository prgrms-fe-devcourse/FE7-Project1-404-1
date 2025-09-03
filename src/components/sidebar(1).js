import { getRootDocuments } from "../api/documents.js";
import { createDocumentItem } from "./documentManager/createDocumentItems.js";
// 각 문서 - 아이디(숫자)/제목(문자열)/자식목록(배열)
function renderDocuments(docs) {
  let html = `<ul>`;

  for (const doc of docs) {
    html += `<li>${doc.title}<button id="add">+</button><button id="del">🗑️</button></li>`;

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

  document.querySelector("#sidebar").addEventListener(
    "mouseenter",
    (e) => {
      if (e.target.tagName === "LI") {
        e.target.style.textDecoration = "line-through";
      }
    },
    true
  );
}
render();
