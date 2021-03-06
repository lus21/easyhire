const initialState = {
  folders: [],
  folderErrors: [],
  loaded: false,
  errors: [],
  responseMsgs: [],
};

const GET_FOLDERS = 'Get folders';
const UPDATE_COUNT = 'Update count';
const CREATE_FOLDER = 'Create folder';
const UPDATE_FOLDER = 'Update folder';
const DELETE_FOLDER = 'Delete folder';
const IS_ACTIVE = 'Is active';
const REFRESH = 'Refresh';
const DELETE_EMAILS = 'Delete emails';
const MOVE_EMAILS = 'Update Email Folders';
const CLEAR_ERROR = 'Clear error';
const CLEAR_RESPONSEMSG = 'Clear response msg';

function getFolders(result) {
  return {
    type: GET_FOLDERS,
    payload: {
      folders: result.folders,
      inboxCount: result.inboxCount,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

function createFolder(response) {
  return {
    type: CREATE_FOLDER,
    payload: {
      createdFolder: response.createdFolder,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}

function updateFolder(response) {
  return {
    type: UPDATE_FOLDER,
    payload: {
      updatedFolder: response.updatedFolder,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}

function deleteFolder(response) {
  return {
    type: DELETE_FOLDER,
    payload: {
      deletedFolderID: response.deletedFolderID,
      errors: response.errors,
      responseMsgs: response.responseMsgs,
    },
  };
}

function moveEmails(response) {
  return {
    type: MOVE_EMAILS,
    payload: {
      emailsToMove: response.emailsToMove,
      errors: response.errors,
      originalFolder: response.originalFolder,
      responseMsgs: response.responseMsgs,
    },
  };
}

function deleteEmails(response) {
  return {
    type: DELETE_EMAILS,
    payload: {
      emailsToDelete: response.emailsToDelete,
      errors: response.errors,
      originalFolder: response.originalFolder,
      responseMsgs: response.responseMsgs,
    },
  };
}

export function isActive(item) {
  return {
    type: IS_ACTIVE, payload: { isActive: true, id: item._id },
  };
}

function refresh(result) {
  return {
    type: REFRESH,
    payload: {
      folders: result.folders,
      inboxCount: result.inboxCount,
      errors: result.errors,
      responseMsgs: result.responseMsgs,
    },
  };
}

export function clearError(value) {
  return {
    type: CLEAR_ERROR,
    payload: { error: value },
  };
}
export function clearResponseMsg(value) {
  return {
    type: CLEAR_RESPONSEMSG,
    payload: { responseMsg: value },
  };
}

export function asyncGetFolders() {
  return function asyncGetEmailsInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(getFolders(result));
      })
      .catch(() => {});
  };
}

export function asyncCreateFolder(body) {
  return function asyncCreateFolderInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(createFolder(result));
      }).catch(() => {});
  };
}

export function asyncUpdateFolder(body) {
  const updatedFolder = { id: body.id, folderName: body.folderName };
  return function asyncUpdateFolderInner(dispatch) {
    fetch(`http://localhost:3000/api/folders/${updatedFolder.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFolder),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(updateFolder(result));
      }).catch(() => {});
  };
}

export function asyncDeleteFolder(id) {
  return function asyncDeleteFolderInner(dispatch) {
    fetch(`http://localhost:3000/api/folders/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteFolder(result));
      }).catch(() => {});
  };
}

export function asyncMoveEmails(emailIds, folderId) {
  return function asyncPostEmailsToFolderInner(dispatch) {
    fetch('http://localhost:3000/api/emails/move', {
      method: 'POST',
      body: JSON.stringify({ emailIds, folderId }),
      headers: {
        Origin: '', 'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(moveEmails(result));
      }).catch(() => {});
  };
}

export function asyncDeleteEmails(emailIds) {
  return function asyncDeleteEmailsInner(dispatch) {
    fetch(`http://localhost:3000/api/emails/${emailIds}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(deleteEmails(result));
      }).catch(() => {});
  };
}
export function asyncRefreshFolders() {
  return function asyncRefreshInner(dispatch) {
    fetch('http://localhost:3000/api/folders', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((result) => {
        dispatch(refresh(result));
      }).catch(() => {});
  };
}

export function updateCount() {
  asyncGetFolders();
  return {
    type: UPDATE_COUNT,
  };
}
/**
 * Reducer
 */

export default function folderReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_FOLDERS:
      return {
        ...state,
        folders: [
          {
            _id: 'allEmails',
            name: 'Inbox',
            icon: 'fa-inbox',
            isActive: true,
            count: payload.inboxCount,
            sentCount: 0,
            user_id: null,
          },
          ...payload.folders
            .map(folder => Object.assign({}, folder, { isActive: !!folder.isActive })),
        ],
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearFolderError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearFolderResponseMsg' })),
      };
    case UPDATE_COUNT:
      return {
        ...state,
      };
    case IS_ACTIVE:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder._id === payload.id) {
            Object.assign(folder, { isActive: payload.isActive });
          } else {
            Object.assign(folder, { isActive: false });
          }
          return folder;
        }),
      };
    case MOVE_EMAILS: {
      let nOffAffected = 0;
      const foldersAfterMove = state.folders.map((folder) => {
        nOffAffected = payload.originalFolder.map(origF => origF === folder._id.toString).length;
        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffAffected;
        }
        if (payload.emailsToMove[0].folder._id === folder._id) {
          folder.count += nOffAffected;
        }
        return folder;
      });
      return {
        ...state,
        folders: foldersAfterMove,
        errors: [],
        responseMsgs: [],
      };
    }
    case DELETE_EMAILS: {
      let nOffDeleted = 0;
      const afterDelete = state.folders.map((folder) => {
        nOffDeleted = payload.originalFolder.map(origF => origF === folder._id).length;
        if (folder._id === 'allEmails') {
          folder.count -= nOffDeleted;
        }
        if (payload.originalFolder.indexOf(folder._id) !== -1) {
          folder.count -= nOffDeleted;
        }
        return folder;
      });
      return {
        ...state,
        folders: afterDelete,
        errors: [],
        responseMsgs: [],
      };
    }
    case CREATE_FOLDER: {
      const folders = payload.createdFolder._id ? [
        ...state.folders,
        Object.assign({}, payload.createdFolder, { isActive: false }),
      ] : state.folders;
      return {
        ...state,
        folders,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearFolderError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearFolderResponseMsg' })),
      };
    }
    case UPDATE_FOLDER:
      return {
        ...state,
        folders: state.folders.map((folder) => {
          if (folder._id === payload.updatedFolder._id.toString()) {
            folder.name = payload.updatedFolder.name;
          }
          return folder;
        }),
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearFolderError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearFolderResponseMsg' })),
      };
    case DELETE_FOLDER: {
      const foldersAfterDelete = state.folders
        .filter(folder => folder._id !== payload.deletedFolderID);
      return {
        ...state,
        folders: foldersAfterDelete,
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearFolderError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearFolderResponseMsg' })),
      };
    }
    case REFRESH:
      return {
        ...state,
        folders: [
          {
            _id: 'allEmails',
            name: 'Inbox',
            icon: 'fa-inbox',
            isActive: true,
            count: payload.inboxCount,
          },
          ...payload.folders.map(folder =>
            Object.assign({}, folder, { isActive: !!folder.isActive })),
        ],
        errors: payload.errors
          .map(error => Object.assign({}, error, { clearFunction: 'clearFolderError' })),
        responseMsgs: payload.responseMsgs
          .map(responseMsg => Object.assign({}, responseMsg, { clearFunction: 'clearFolderResponseMsg' })),
        loaded: true,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.msg !== payload.error),
      };
    case CLEAR_RESPONSEMSG:
      return {
        ...state,
        responseMsgs: state.responseMsgs
          .filter(responseMsg => responseMsg.msg !== payload.responseMsg),
      };
    default:
      return state;
  }
}
