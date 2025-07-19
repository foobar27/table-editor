import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Person {
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

interface PersonState {
  data: Person[];
  loading: boolean;
}

const initialState: PersonState = {
  data: [
    { name: 'John', age: 30, status: 'active' },
    { name: 'Sara', age: 25, status: 'inactive' },
  ],
  loading: false,
};

const personSlice = createSlice({
  name: 'person',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<Person[]>) => {
      state.data = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setData, setLoading } = personSlice.actions;

const store = configureStore({
  reducer: {
    person: personSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 