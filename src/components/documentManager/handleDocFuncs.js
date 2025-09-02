// src/components/documentManager/handleDocFuncs.js
import { postNewDocument, deleteDocument, getRootDocuments } from "../../api/documents.js";
import { navigate, route } from "../router.js";
import { createDocumentItem } from "./createDocumentItems.js";

/**
 * 사이드바 전체 초기화
 */
export const removeAllActiveClasses = () => {
  document.querySelectorAll(".sidebar__menuWrapper--document").forEach((el) => {
    el.classList.remove("active__document-item");
  });
};

/**
 * Root 문서 생성
 */
export const addRootDoc = async () => {
  try {
    const newDoc = await postNewDocument("untitled", null);

    const list = document.getElementById("document-list");
    if (list) await createDocumentItem(newDoc, list);

    // editor 초기화 후 이동
    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    console.error("Root 문서 생성 실패:", err);
  }
};

/**
 * 하위 문서 생성
 */
export const addDoc = async (parentId) => {
  try {
    const parentEl = document.getElementById(`document-container-${parentId}`);
    if (!parentEl) return console.error("부모 요소 없음");

    const subList = parentEl.querySelector(".sub-document-list");
    if (!subList) return console.error("하위 ul 요소 없음");

    const newDoc = await postNewDocument("untitled", parentId);
    await createDocumentItem(newDoc, subList);

    if (subList.style.display === "none") subList.style.display = "block";

    // editor 초기화 후 이동
    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    console.error("하위 문서 생성 실패:", err);
  }
};

/**
 * 문서 삭제
 */
export const removeDoc = async (docId) => {
  try {
    await deleteDocument(docId);
    console.log(`문서 ${docId} 삭제 완료`);

    // 사이드바 갱신
    await refreshDocumentList();

    // 삭제한 문서가 현재 열려 있다면 홈으로
    if (location.pathname.includes(docId)) {
      history.pushState(null, "", "/");
      route();
    }
  } catch (err) {
    console.error("문서 삭제 실패:", err);
  }
};

/**
 * 사이드바 전체 갱신
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
