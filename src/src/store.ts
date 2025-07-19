import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Person {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  children?: Person[];
}

interface PersonState {
  data: Person[];
  loading: boolean;
}

const initialState: PersonState = {
  data: [
    { 
      id: '1', 
      name: 'John', 
      age: 30, 
      status: 'active',
      children: [
        { id: '1-1', name: 'Alice', age: 25, status: 'active' },
        { id: '1-2', name: 'Bob', age: 28, status: 'inactive' }
      ]
    },
    { 
      id: '2', 
      name: 'Sara', 
      age: 25, 
      status: 'inactive',
      children: [
        { id: '2-1', name: 'Charlie', age: 22, status: 'active' }
      ]
    },
  ],
  loading: false,
};

// Helper function to recursively find and update a person
const updatePersonRecursive = (persons: Person[], targetId: string, updatedPerson: Person): Person[] => {
  return persons.map(person => {
    if (person.id === targetId) {
      return updatedPerson;
    }
    if (person.children) {
      return {
        ...person,
        children: updatePersonRecursive(person.children, targetId, updatedPerson)
      };
    }
    return person;
  });
};

// Helper function to recursively find and delete a person
const deletePersonRecursive = (persons: Person[], targetId: string): Person[] => {
  return persons
    .filter(person => person.id !== targetId)
    .map(person => {
      if (person.children) {
        return {
          ...person,
          children: deletePersonRecursive(person.children, targetId)
        };
      }
      return person;
    });
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
      state.data = updatePersonRecursive(state.data, action.payload.id, action.payload);
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      state.data = deletePersonRecursive(state.data, action.payload);
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