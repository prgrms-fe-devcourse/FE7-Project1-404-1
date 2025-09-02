import { getTargetContent } from "../../api/documents.js";
import { addDoc, removeAllActiveClasses } from "./handleDocFuncs.js";

export const createDocumentItem = async (doc, parentElement = null) => {
  const path = `/documents/${doc.id}`;

  // li 요소 생성
  const newDocument = document.createElement("li");
  newDocument.classList.add("sidebar__menuWrapper--document");
  newDocument.id = `document-container-${doc.id}`;
  newDocument.innerHTML = `
    <div class="document-row">
      #
        ${doc.title ?? "untitled"}
      </a>
      <button class="add-subdoc-btn" data-parent-id="${doc.id}" aria-label="하위 문서 추가">+</button>
    </div>
    <ul class="sub-document-list" style="display:none;"></ul>
  `;

  // 트리에 삽입
  if (parentElement) {
    parentElement.appendChild(newDocument);
  } else {
    const documentList = document.getElementById("document-list");
    if (documentList) documentList.appendChild(newDocument);
    else console.error("document-list 요소를 찾을 수 없습니다.");
  }

  // 하위 문서 재귀 렌더링
  if (doc.documents && doc.documents.length > 0) {
    const subDocList = newDocument.querySelector(".sub-document-list");
    for (const sub of doc.documents) {
      await createDocumentItem(sub, subDocList);
    }
  }

  // Hover 표시
  newDocument.addEventListener("mouseenter", () => {
    newDocument.classList.add("hover__document-item");
  });
  newDocument.addEventListener("mouseleave", () => {
    newDocument.classList.remove("hover__document-item");
  });

  // 문서/항목 클릭
  newDocument.addEventListener("click", async (event) => {
    try {
      const target = event.target;

      // 하위 문서 영역 클릭 시: 전파 중단
      if (target.closest(".sub-document-list")) {
        event.stopPropagation();

        // 하위 링크 클릭 처리
        const clickedLink = target.closest(".document-link");
        if (clickedLink) {
          const docId = clickedLink.dataset.url.replace("doc", "");
          navigate(`/documents/${docId}`);
          const docData = await getTargetContent(docId);

          const titleEl = document.getElementById("editor__title-input");
          const contentEl = document.getElementById("editor__content-input");
          if (titleEl) titleEl.value = docData?.title ?? "";
          if (contentEl) contentEl.value = docData?.content ?? "";

          if (typeof updateBreadcrumb === "function") {
            await updateBreadcrumb(docId);
          }
        }
        return;
      }

      // + 버튼 클릭 시: 전파 중단하고 하위 문서 생성
      if (target.closest(".add-subdoc-btn")) {
        event.stopPropagation();
        const parentId = target.closest(".add-subdoc-btn")?.dataset?.parentId;
        if (parentId) await addDoc(parentId);
        return;
      }

      // 일반 문서 항목 클릭
      event.preventDefault();

      removeAllActiveClasses();
      newDocument.classList.add("active__document-item"); // 오탈자 수정

      navigate(path);

      const docData = await getTargetContent(doc.id);
      const titleEl = document.getElementById("editor__title-input");
      const contentEl = document.getElementById("editor__content-input");
      if (titleEl) {
        titleEl.disabled = false;
        titleEl.value = docData?.title ?? "";
      }
      if (contentEl) {
        contentEl.disabled = false;
        contentEl.value = docData?.content ?? "";
      }

      if (typeof updateBreadcrumb === "function") {
        await updateBreadcrumb(doc.id);
      }

      const subList = newDocument.querySelector(".sub-document-list");
      if (subList) {
        subList.style.display = subList.style.display === "none" ? "block" : "none";
      }
    } catch (err) {
      console.error("문서 항목 클릭 처리 중 오류:", err);
    }
  });

  // 하위 문서 추가 버튼
  const addButton = newDocument.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const parentId = addButton.dataset.parentId;
      if (parentId) await addDoc(parentId);
    });
  }
};
