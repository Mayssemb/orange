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

const initialState = {
  proposals: [],
  loading: false,
  error: null,
};

const proposalReducer = (state = initialState, action) => {
  switch (action.type) {
    case PFE_FETCH_REQUEST:
    case PFE_CREATE_REQUEST:
    case PFE_UPDATE_STATUS_REQUEST:
      return { ...state, loading: true };

    case PFE_FETCH_SUCCESS:
      return { ...state, loading: false, proposals: action.payload };

    case PFE_CREATE_SUCCESS:
      return { ...state, loading: false, proposals: [...state.proposals, action.payload] };

    case PFE_UPDATE_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        proposals: state.proposals.map(p => (p.id === action.payload.id ? action.payload : p)),
      };

    case PFE_FETCH_FAIL:
    case PFE_CREATE_FAIL:
    case PFE_UPDATE_STATUS_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
export default proposalReducer;