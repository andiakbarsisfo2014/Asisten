import { createStore, combineReducers } from 'redux';
import { createAction, handleActions } from 'redux-actions';

const appInitialState = {
  detik: 0,
};

const SET_DETIK = 'SET_DETIK';
export const setDetik = createAction(SET_DETIK);

const App = handleActions(
  {
    [SET_DETIK]: (state, { payload }) => ({
      ...state,
      detik: payload,
    }),
  },
  appInitialState,
);

const rootReducer = combineReducers({
  App,
});

const configureStore = () => createStore(rootReducer);
export const store = configureStore();