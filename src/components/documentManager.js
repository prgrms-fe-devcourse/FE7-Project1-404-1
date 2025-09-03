import { postNewDocument, deleteDocument, getRootDocuments } from "../api/documentAPI.js";
import { navigate, route } from "./sidebar.js";

// 현재 활성화된 문서 ID를 추적하는 전역변수
let currentActiveDocumentId = null;

/**
 * 사이드바에서 활성화된 모든 문서의 클래스를 제거합니다.
 */
export const removeAllActiveClasses = () => {
  document.querySelectorAll(".sidebar__menuWrapper--document").forEach((el) => {
    el.classList.remove("active__document-item");
  });
};

/**
 * 새로운 Root 문서를 생성하고 사이드바에 추가합니다.
 */
export const addRootDoc = async () => {
  try {
    const newDoc = await postNewDocument("untitled", null);
    const list = document.getElementById("document-list");
    if (list) {
      await createDocumentItem(newDoc, list);
    }
    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    console.error("Root 문서 생성 실패:", err);
  }
};

/**
 * 특정 부모 문서 아래에 하위 문서를 생성합니다.
 */
export const addDoc = async (parentId) => {
  try {
    const parentEl = document.getElementById(`document-container-${parentId}`);
    if (!parentEl) return console.error("부모 요소 없음");

    const subList = parentEl.querySelector(".sub-document-list");
    if (!subList) return console.error("하위 ul 요소 없음");

    const newDoc = await postNewDocument("untitled", parentId);
    await createDocumentItem(newDoc, subList);

    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    console.error("하위 문서 생성 실패:", err);
  }
};

/**
 * 특정 문서 삭제
 */
export const removeDoc = async (docId) => {
  try {
    await deleteDocument(docId);
    console.log(`문서 ${docId} 삭제 완료`);
    await refreshDocumentList();

    if (location.pathname.indexOf(docId) !== -1) {
      history.pushState(null, "", "/");
      route();
    }
  } catch (err) {
    console.error("문서 삭제 실패:", err);
  }
};

/**
 * 전체 문서 목록 새로고침
 */
export const refreshDocumentList = async () => {
  const rootList = document.getElementById("document-list");
  if (!rootList) return;

  rootList.innerHTML = "";

  const roots = await getRootDocuments();
  for (const doc of roots) {
    await createDocumentItem(doc, rootList);
  }
};

/**
 * 문서 항목(<li>) 생성
 */
export const createDocumentItem = async (doc, parentElement = null) => {
  const li = document.createElement("li");
  li.classList.add("sidebar__menuWrapper--document");
  li.id = `document-container-${doc.id}`;

  const title = doc.title ? doc.title : "untitled";

  li.innerHTML = `
    <div class="document-row">
      <button class="delete-doc-btn" data-doc-id="${doc.id}" aria-label="문서 삭제">x</button>
      <span class="document-title">${title}</span>
      <div class="document-actions">
        <button class="add-subdoc-btn" data-parent-id="${doc.id}" aria-label="하위 문서 추가">+</button>
      </div>
    </div>
    <ul class="sub-document-list" style="display:block;"></ul>
  `;

  if (parentElement) parentElement.appendChild(li);
  else {
    const rootList = document.getElementById("document-list");
    if (rootList) rootList.appendChild(li);
  }

  // 하위 문서 재귀 생성 (중복 방지)
  if (doc.documents && doc.documents.length > 0) {
    const subList = li.querySelector(".sub-document-list");
    for (const sub of doc.documents) {
      if (sub.id !== doc.id) {
        await createDocumentItem(sub, subList);
      }
    }
  }

  // Hover 효과
  li.addEventListener("mouseenter", () => li.classList.add("hover__document-item"));
  li.addEventListener("mouseleave", () => li.classList.remove("hover__document-item"));

  // + 버튼 클릭
  const addButton = li.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const parentId = addButton.dataset.parentId;
      if (parentId) await addDoc(parentId);
    });
  }

  // x 버튼 클릭
  const deleteButton = li.querySelector(".delete-doc-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const docId = deleteButton.dataset.docId;

      try {
        await deleteDocument(docId);
        li.remove();

        if (location.pathname.indexOf(docId) !== -1) {
          history.pushState(null, "", "/");
          const editorMount = document.getElementById("editor-mount-point");
          if (editorMount) {
            editorMount.innerHTML = `
              <div class="placeholder">
                <p>+ 버튼을 눌러 새 페이지를 만드세요.</p>
              </div>
            `;
          }
        }
      } catch (err) {
        console.error("문서 삭제 실패:", err);
      }
    });
  }
};

// 이벤트 위임으로 클릭 처리해서 하위 문서 조회시 중복 이벤트 방지

document.addEventListener("DOMContentLoaded", () => {
  const documentList = document.getElementById("document-list");
  if (!documentList) return;

  documentList.addEventListener("click", (event) => {
    const li = event.target.closest(".sidebar__menuWrapper--document");
    if (!li) return;

    // +  x 버튼 클릭이면 무시
    if (event.target.closest(".add-subdoc-btn") || event.target.closest(".delete-doc-btn")) return;

    // 활성화 클래스 처리
    removeAllActiveClasses();
    li.classList.add("active__document-item");

    const docId = li.id.replace("document-container-", "");
    navigate(`/documents/${docId}`);
  });
});
