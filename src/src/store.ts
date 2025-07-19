import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Person {
  id: string;
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
    { id: '1', name: 'John', age: 30, status: 'active' },
    { id: '2', name: 'Sara', age: 25, status: 'inactive' },
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
    addPerson: (state, action: PayloadAction<Omit<Person, 'id'>>) => {
      const newPerson: Person = {
        ...action.payload,
        id: Date.now().toString(), // Simple ID generation
      };
      state.data.push(newPerson);
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const index = state.data.findIndex(person => person.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = action.payload;
      }
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(person => person.id !== action.payload);
    },
  },
});

export const { setData, setLoading, addPerson, updatePerson, deletePerson } = personSlice.actions;

const store = configureStore({
  reducer: {
    person: personSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 