// src/store/actions.ts
export const addToNumber = (value: number) => ({
  type: 'ADD_TO_NUMBER',
  payload: value
});

export const subtractFromNumber = (value: number) => ({
  type: 'SUBTRACT_FROM_NUMBER',
  payload: value
});
