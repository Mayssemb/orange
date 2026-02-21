import {
  USERS_FETCH_REQUEST,
  USERS_FETCH_SUCCESS,
  USERS_FETCH_FAIL,
  USER_CREATE_REQUEST,
  USER_CREATE_SUCCESS,
  USER_CREATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_FETCH_BY_EMAIL_REQUEST,
  USER_FETCH_BY_EMAIL_SUCCESS,
  USER_FETCH_BY_EMAIL_FAIL
} from './userConstants';

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case USERS_FETCH_REQUEST:
    case USER_CREATE_REQUEST:
    case USER_UPDATE_REQUEST:
    case USER_FETCH_BY_EMAIL_REQUEST:
      return { ...state, loading: true };

    case USERS_FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    case USER_FETCH_BY_EMAIL_SUCCESS:
      return { ...state, loading: false, users: [action.payload] };

    case USER_CREATE_SUCCESS:
      return { ...state, loading: false, users: [...state.users, action.payload] };

    case USER_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map(u => (u.id === action.payload.id ? action.payload : u)),
      };

    case USERS_FETCH_FAIL:
    case USER_CREATE_FAIL:
    case USER_UPDATE_FAIL:
    case USER_FETCH_BY_EMAIL_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export default userReducer;