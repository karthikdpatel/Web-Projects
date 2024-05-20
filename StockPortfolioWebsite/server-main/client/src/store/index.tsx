// src/store/index.ts
import { createStore } from 'redux';
import { numberReducer } from './reducer';

const store = createStore(numberReducer);

export default store;
