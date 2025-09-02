import { http } from "./https.js";

export const getRootDocuments = () => http.get("/documents");
export const getDocument = (id) => http.get(`/documents/${id}`);
export const createDocument = (data) => http.post(`documents`, data);
export const updateDocument = (id, data) => http.get(`/documents/${id}`, data);
export const deleteDocument = (id) => http.delete(`documents/${id}`);
