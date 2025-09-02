// src/components/documentManager/createDocumentList.js
import { getRootDocuments } from "../../api/documents.js";
import { createDocumentItem } from "./createDocumentItems.js";

export const createDocumentsList = async () => {
  const list = document.getElementById("document-list");
  if (!list) return;

  // 기존 DOM 초기화 → 이벤트 중복 방지
  list.innerHTML = "";

  try {
    const docs = await getRootDocuments(); // 여기만 바뀜
    for (const doc of docs) {
      await createDocumentItem(doc, list);
    }
  } catch (err) {
    console.error("문서 목록 가져오기 실패:", err);
  }
};
