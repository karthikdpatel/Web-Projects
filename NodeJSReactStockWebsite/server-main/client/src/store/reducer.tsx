// src/store/reducer.ts
export interface AppState {
  number: number;
}

const initialState: AppState = {
  number: 25000
};

export const numberReducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case 'ADD_TO_NUMBER':
      return { ...state, number: state.number + action.payload };
    case 'SUBTRACT_FROM_NUMBER':
      return { ...state, number: state.number - action.payload };
    default:
      return state;
  }
};
