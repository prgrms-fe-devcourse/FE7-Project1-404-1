// src/components/documentManager/createDocumentItems.js
import { addDoc } from "./handleDocFuncs.js";
import { deleteDocument } from "../../api/documents.js";
import { createDocumentsList } from "./createDocumentList.js";
import { navigate } from "../router.js";

/**
 * 하나의 Document 항목 생성
 * @param {Object} doc - 문서 데이터 {id, title, documents}
 * @param {HTMLElement} parentElement - 부모 ul 요소
 */
export const createDocumentItem = async (doc, parentElement = null) => {
  const li = document.createElement("li");
  li.classList.add("sidebar__menuWrapper--document");
  li.id = `document-container-${doc.id}`;
  li.innerHTML = `
    <div class="document-row">
      <button class="delete-doc-btn" data-doc-id="${doc.id}" aria-label="문서 삭제">x</button>
      <span>${doc.title ?? "untitled"}</span>
      <div class="document-actions">
        <button class="add-subdoc-btn" data-parent-id="${doc.id}" aria-label="하위 문서 추가">+</button>
      </div>
    </div>
    <ul class="sub-document-list" style="display:none;"></ul>
  `;

  // 부모 요소에 삽입
  if (parentElement) parentElement.appendChild(li);
  else document.getElementById("document-list")?.appendChild(li);

  // 하위 문서 재귀 렌더링
  if (doc.documents?.length > 0) {
    const subList = li.querySelector(".sub-document-list");
    for (const sub of doc.documents) {
      await createDocumentItem(sub, subList);
    }
  }

  // Hover 효과
  li.addEventListener("mouseenter", () => li.classList.add("hover__document-item"));
  li.addEventListener("mouseleave", () => li.classList.remove("hover__document-item"));

  // + 버튼 클릭 → 하위 문서 생성
  const addButton = li.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const parentId = addButton.dataset.parentId;
      if (parentId) await addDoc(parentId);

      // 하위 목록 보이기
      const subList = li.querySelector(".sub-document-list");
      if (subList && subList.style.display === "none") subList.style.display = "block";
    });
  }

  // X 버튼 클릭 → 문서 삭제 + 에디터 초기화
  const deleteButton = li.querySelector(".delete-doc-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const docId = deleteButton.dataset.docId;

      try {
        await deleteDocument(docId);

        // 현재 li 요소만 제거
        li.remove();

        // 삭제된 문서가 열려있으면 홈 화면으로 초기화
        if (location.pathname.includes(docId)) {
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

  // 문서 클릭 → 에디터 열기
  li.addEventListener("click", (event) => {
    if (event.target.closest(".add-subdoc-btn") || event.target.closest(".delete-doc-btn")) return;
    if (event.detail === 2) return; // 더블클릭 무시
    navigate(`/documents/${doc.id}`);
  });
};
