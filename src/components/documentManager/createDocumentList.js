import { getRootDocuments } from "../../api/documents.js";
import { createDocumentItem } from "./createDocumentItems.js";

export const createDocumentsList = async () => {
  const documentList = document.getElementById("document-list");
  if (!documentList) {
    console.error("document-list 요소를 찾을 수 없습니다.");
    return;
  }

  // 누적 방지: 초기화
  documentList.innerHTML = "";

  try {
    // Root 문서 가져오기 (API 래퍼 사용)
    const docsJSON = await getRootDocuments();
    for (const doc of docsJSON) {
      await createDocumentItem(doc, documentList);
    }
  } catch (error) {
    console.error("문서 목록 가져오기 실패:", error);
  }
};
