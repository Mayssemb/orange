import axios from 'axios';
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
} from './usersConstants';

const BASE_URL = 'http://localhost:3000/users';

export const fetchUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USERS_FETCH_REQUEST });
    const { data } = await axios.get(BASE_URL);
    dispatch({ type: USERS_FETCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USERS_FETCH_FAIL, payload: error.message });
  }
};

export const fetchUserByEmail = (email) => async (dispatch) => {
  try {
    dispatch({ type: USER_FETCH_BY_EMAIL_REQUEST });
    const { data } = await axios.get(`${BASE_URL}/email`, { params: { email } });
    dispatch({ type: USER_FETCH_BY_EMAIL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_FETCH_BY_EMAIL_FAIL, payload: error.message });
  }
};

export const createUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: USER_CREATE_REQUEST });
    const { data } = await axios.post(BASE_URL, userData);
    dispatch({ type: USER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_CREATE_FAIL, payload: error.message });
  }
};

export const updateUser = (id, data) => async (dispatch) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST });
    const res = await axios.patch(`${BASE_URL}/${id}`, data);
    dispatch({ type: USER_UPDATE_SUCCESS, payload: res.data });
  } catch (error) {
    dispatch({ type: USER_UPDATE_FAIL, payload: error.message });
  }
};
