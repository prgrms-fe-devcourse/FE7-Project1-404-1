import { http } from "./https.js";

// Root 문서 가져오기
export const getRootDocuments = () => http.get(`/documents`);

// 특정 문서 조회
export const getTargetContent = (docId) => http.get(`/documents/${docId}`);

// 새 문서 생성
export const postNewDocument = (title, parentId = null) => http.post(`/documents`, { title, parent: parentId });

// 문서 업데이트
export const updateDocument = (id, data) => http.put(`/documents/${id}`, data);

// 문서 삭제
export const deleteDocument = async (docId) => {
  return http.delete(`/documents/${docId}`);
};