// src/components/NumberDisplay.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../store/reducer';
import { addToNumber, subtractFromNumber } from '../store/actions';

const NumberDisplay: React.FC = () => {
  const number = useSelector((state: AppState) => state.number);
  const dispatch = useDispatch();

  const handleAdd = (val: number) => {
    dispatch(addToNumber(val)); // Example: Add 1000 to the number
  };

  const handleSubtract = (val: number) => {
    dispatch(subtractFromNumber(val)); // Example: Subtract 1000 from the number
  };

  return (
      <p>{number}</p>
  );
};

export default NumberDisplay;
