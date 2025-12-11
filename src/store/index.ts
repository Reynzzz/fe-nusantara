import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './slices/eventsSlice';
import newsReducer from './slices/newsSlice';
import productsReducer from './slices/productsSlice';
import aboutReducer from './slices/aboutSlice';
import milestonesReducer from './slices/milestoneSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    news: newsReducer,
    products: productsReducer,
    about: aboutReducer,
    milestones: milestonesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

