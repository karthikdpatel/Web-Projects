import { createStore } from 'redux';

const initialState = {
  number: 25000
};

const numberReducer = (state = initialState, action: { type: any; payload: number; }) => {
  switch (action.type) {
    case 'ADD_TO_NUMBER':
      return {
        ...state,
        number: state.number + action.payload
      };
    case 'SUBTRACT_FROM_NUMBER':
      return {
        ...state,
        number: state.number - action.payload
      };
    default:
      return state;
  }
};

const store = createStore(numberReducer);

export default store;

