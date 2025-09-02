import { http } from "./https.js";

// Root 문서 가져오기
export const getRootDocuments = () => http.get(`/documents`);

// 특정 문서 조회
export const getTargetContent = (docId) => http.get(`/documents/${docId}`);

// 새 문서 생성
export const postNewDocument = (title, parentId = null) =>
  http.post(`/documents`, { title, parent: parentId });

// // 문서 초기화
// export const initializeDocumentContent = (docId) =>
//   http.put(`/documents/${docId}`, { title: "제목", content: "내용" });

// // 문서 수정
// export const editContent = (docId, title, content) =>
//   http.put(`/documents/${docId}`, { title, content });

// // 자동 저장
// export const AutoSave = (docId, title, content) =>
//   http.put(`/documents/${docId}`, { title, content });

// 문서 삭제
export const deleteDocument = async (docId) => {
  return http.delete(`/documents/${docId}`);
};