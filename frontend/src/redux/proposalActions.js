import axios from 'axios';
import {
  PFE_FETCH_REQUEST,
  PFE_FETCH_SUCCESS,
  PFE_FETCH_FAIL,
  PFE_CREATE_REQUEST,
  PFE_CREATE_SUCCESS,
  PFE_CREATE_FAIL,
  PFE_UPDATE_STATUS_REQUEST,
  PFE_UPDATE_STATUS_SUCCESS,
  PFE_UPDATE_STATUS_FAIL
} from './proposalConstants';

const BASE_URL = 'http://localhost:3000/pfe';


export const fetchProposals = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("access_token");

    dispatch({ type: PFE_FETCH_REQUEST });

    const { data } = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: PFE_FETCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PFE_FETCH_FAIL, payload: error.message });
  }
};

export const createProposal = (dto) => async (dispatch) => {
  try {
    dispatch({ type: PFE_CREATE_REQUEST });
    const userInfo = JSON.parse(localStorage.getItem("userInfo")); 
    const token = userInfo?.access_token;

    const { data } = await axios.post(BASE_URL, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: PFE_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PFE_CREATE_FAIL, payload: error.message });
  }
};

export const updateProposalStatus = (id, status) => async (dispatch) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.access_token;

    dispatch({ type: PFE_UPDATE_STATUS_REQUEST });
    const { data } = await axios.patch(`${BASE_URL}/${id}`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch({ type: PFE_UPDATE_STATUS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: PFE_UPDATE_STATUS_FAIL, payload: error.message });
  }
};
