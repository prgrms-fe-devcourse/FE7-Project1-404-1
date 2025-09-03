// src/documentManager/handleDocFuncs.js

// src/documentManager/handleDocFuncs.js
import { postNewDocument } from "@api/documents.js";
import { createDocumentItem } from "./createDocumentItems.js";
//...

// import { postNewDocument } from "../../api/documents.js";
// import { createDocumentItem } from "./createDocumentItems.js";

// active 클래스 초기화
export const removeAllActiveClasses = () => {
  document
    .querySelectorAll(".sidebar__menuWrapper--document")
    .forEach((container) => {
      container.classList.remove("active__document-item"); // 오탈자 수정
    });
};

// Root 문서 생성
export const addRootDoc = async () => {
  try {
    const newDocument = await postNewDocument("untitled", null);
    const documentList = document.getElementById("document-list");
    if (documentList) {
      await createDocumentItem(newDocument, documentList);
      navigate(`/documents/${newDocument.id}`);
    }
  } catch (error) {
    console.error("새 페이지 생성 실패:", error);
  }
};

// 하위 문서 생성
export const addDoc = async (parentId) => {
  const parentElement = document.getElementById(`document-container-${parentId}`);
  if (!parentElement) {
    console.error("부모 요소를 찾을 수 없습니다.");
    return;
  }
  const subDocumentList = parentElement.querySelector(".sub-document-list");
  if (!subDocumentList) {
    console.error("하위 문서 목록 요소를 찾을 수 없습니다.");
    return;
  }

  try {
    const newDocument = await postNewDocument("untitled", parentId);
    await createDocumentItem(newDocument, subDocumentList);
    navigate(`/documents/${newDocument.id}`);
    if (subDocumentList.style.display === "none") {
      subDocumentList.style.display = "block";
    }
  } catch (error) {
    console.error("하위 페이지 생성 실패:", error);
  }
};
