// src/components/documentManager/documentHandler.js

import {
  postNewDocument,
  deleteDocument,
  getRootDocuments,
} from "../api/documentAPI.js";
import { navigate, route } from "./sidebar.js";

// 현재 활성화된 문서 ID를 추적하는 전역변수
let currentActiveDocumentId = null;

/**
 * 사이드바에서 활성화된 모든 문서의 클래스를 제거합니다.
 * 이를 통d해 모든 문서가 비활성화 상태가 됩니다.
 */
export const removeAllActiveClasses = () => {
  document.querySelectorAll(".sidebar__menuWrapper--document").forEach((el) => {
    el.classList.remove("active__document-item");
  });
};

// 새로운 Root 문서를 생성하고 사이드바에 추가합니다.
export const addRootDoc = async () => {
  try {
    // untitled 제목과 부모 ID 없이 새 문서를 생성
    const newDoc = await postNewDocument("untitled", null);

    // 문서 목록 요소를 호출
    const list = document.getElementById("document-list");

    // list 요소가 존재하면 새 문서 항목을 생성하고 추가
    if (list) {
      await createDocumentItem(newDoc, list);
    }

    // 새로운 문서의 editor 페이지로 이동
    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    // 문서 생성 실패 시 오류 메시지를 콘솔에 출력
    console.error("Root 문서 생성 실패:", err);
  }
};

// 특정 부모 문서 아래에 하위 문서를 생성합니다.
export const addDoc = async (parentId) => {
  try {
    // 부모 문서 컨테이너 요소를 서치
    const parentEl = document.getElementById(`document-container-${parentId}`);

    // 부모 요소가 없으면 오류 메시지를 출력하고 함수를 종료
    if (!parentEl) {
      return console.error("부모 요소 없음");
    }

    // 부모 요소 내에서 하위 문서 목록(ul) 요소를 서치
    const subList = parentEl.querySelector(".sub-document-list");

    // 하위 ul 요소가 없으면 오류 메시지를 출력하고 함수를 종료
    if (!subList) {
      return console.error("하위 ul 요소 없음");
    }

    // untitled 제목과 부모 ID를 사용하여 새 문서를 생성
    const newDoc = await postNewDocument("untitled", parentId);

    // 새 문서 항목을 하위 목록에 추가
    await createDocumentItem(newDoc, subList);

    // 새로운 문서의 editor 페이지로 이동
    navigate(`/documents/${newDoc.id}`);
  } catch (err) {
    // 하위 문서 생성 실패 시 오류 메시지를 콘솔에 출력
    console.error("하위 문서 생성 실패:", err);
  }
};

// 특정 문서 ID에 해당하는 문서를 삭제합니다.
export const removeDoc = async (docId) => {
  try {
    // API를 호출하여 문서를 삭제
    await deleteDocument(docId);
    console.log(`문서 ${docId} 삭제 완료`);

    // 문서 목록을 완전히 새로고침하여 사이드바를 갱신
    await refreshDocumentList();

    // 현재 URL에 삭제된 문서 ID가 포함되어 있는지 확인
    // indexOf()를 사용하여 문자열 내 포함 여부를 확인
    if (location.pathname.indexOf(docId) !== -1) {
      // 삭제된 문서가 현재 열려 있다면 홈 페이지로 이동
      history.pushState(null, "", "/");
      route();
    }
  } catch (err) {
    // 문서 삭제 실패 시 오류 메시지를 콘솔에 출력
    console.error("문서 삭제 실패:", err);
  }
};

// 전체 문서 목록을 서버에서 가져와 사이드바를 갱신
export const refreshDocumentList = async () => {
  // 문서 목록 컨테이너 요소를 호출
  const rootList = document.getElementById("document-list");

  // 요소가 없으면 함수를 종료
  if (!rootList) {
    return;
  }

  // 기존 목록을 초기화
  rootList.innerHTML = "";

  // 서버로부터 Root 문서 목록 호출
  const roots = await getRootDocuments();

  // 각 Root 문서에 대해 문서 항목을 생성하고 목록에 추가
  for (const doc of roots) {
    await createDocumentItem(doc, rootList);
  }
};

// 하나의 문서 항목(<li>)을 생성하고 이벤트 리스너를 추가합니다.

export const createDocumentItem = async (doc, parentElement = null) => {
  // 새로운 <li> 요소를 생성합니다.
  const li = document.createElement("li");
  li.classList.add("sidebar__menuWrapper--document");
  li.id = `document-container-${doc.id}`;

  // 문서 제목이 존재하지 않으면 untitled를 기본 값으로 사용합니다.
  let title = "untitled";
  if (doc.title) {
    title = doc.title;
  }

  // 생성한 document(li)에 < x btn / title / + btn > 형태로 innerHTML 작성
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

  // 부모 요소가 지정되었는지 확인
  if (parentElement) {
    // 부모 요소에 하위 문서를 추가
    parentElement.appendChild(li);
  } else {
    // 부모 요소가 없으면, 'document-list' id를 가진 루트 문서로 추가
    const rootList = document.getElementById("document-list");
    if (rootList) {
      rootList.appendChild(li);
    }
  }

  // 문서에 하위 문서가 있는지 확인하고, 있다면 재귀적으로 렌더링합니다.
  if (doc.documents && doc.documents.length > 0) {
    const subList = li.querySelector(".sub-document-list");
    for (const sub of doc.documents) {
      await createDocumentItem(sub, subList);
    }
  }

  // 사이드바에서 document에 마우스를 가져다 놓을 때 Hover 효과를 위한 이벤트 리스너
  li.addEventListener("mouseenter", () => {
    li.classList.add("hover__document-item");
  });
  li.addEventListener("mouseleave", () => {
    li.classList.remove("hover__document-item");
  });

  // + 버튼 클릭 => 하위 문서 생성
  const addButton = li.querySelector(".add-subdoc-btn");
  if (addButton) {
    addButton.addEventListener("click", async (event) => {
      // 이벤트 버블링을 막아 부모 요소의 클릭 이벤트가 실행되지 않게함
      event.stopPropagation();
      const parentId = addButton.dataset.parentId;

      // 만약 parentId가 있으면 addDoc 함수를 호출하여 하위 문서를 추가
      if (parentId) {
        await addDoc(parentId);
      }

      // 하위 문서 요소를 불러옴
      const subList = li.querySelector(".sub-document-list");
    });
  }

  // x 버튼 클릭 => 문서 삭제
  const deleteButton = li.querySelector(".delete-doc-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (event) => {
      // 이벤트 버블링을 막아 부모 요소의 클릭 이벤트가 실행되지 않게함
      event.stopPropagation();
      const docId = deleteButton.dataset.docId;

      try {
        // API를 호출하여 문서를 삭제
        await deleteDocument(docId);

        // DOM에서 현재 <li> 요소를 제거합니다.
        li.remove();

        // 현재 URL에 삭제된 문서 ID가 포함되어 있는지 확인
        // indexOf()를 사용하여 문자열 내 포함 여부를 확인
        if (location.pathname.indexOf(docId) !== -1) {
          // 삭제된 문서가 열려있으면 router로 홈 화면으로 이동
          history.pushState(null, "", "/");

          // editor 마운트 포인트를 가져와 내부 HTML을 비우고 placeHolder를 통해서 기본 화면을 표시
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
        // 문서 삭제 실패 시 오류 메시지를 콘솔에 출력
        console.error("문서 삭제 실패:", err);
      }
    });
  }

  // 문서 항목 클릭 이벤트 => editor 호출해서 문서 편집
  li.addEventListener("click", (event) => {
    // 이벤트의 타겟이 + 또는 x 버튼인지 확인하고, 그렇다면 함수를 종료
    const isActionButton =
      event.target.closest(".add-subdoc-btn") ||
      event.target.closest(".delete-doc-btn");

    if (isActionButton) {
      return;
    }

    // 모든 활성화 클래스를 제거하고 현재 클릭한 항목에만 활성화 클래스를 추가
    removeAllActiveClasses();
    li.classList.add("active__document-item");

    // 새로운 문서 페이지로 이동
    navigate(`/documents/${doc.id}`);
  });
};
