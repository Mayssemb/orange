import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "./authConstants.js";



const initialState = {
  loading: false,
  userInfo: JSON.parse(localStorage.getItem("userInfo")) || null ,

  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case LOGIN_SUCCESS:
      return { ...state, loading: false, userInfo: action.payload };

    case LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...state, userInfo: null };

    default:
      return state;
  }
};
export default authReducer;
