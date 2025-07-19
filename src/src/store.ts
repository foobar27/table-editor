import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Person, ChangeLogEntry } from './types';

interface PersonState {
  data: Person[];
  loading: boolean;
  changelog: ChangeLogEntry[];
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
  changelog: [
    {
      id: 'initial',
      timestamp: new Date().toISOString(),
      action: 'CREATE',
      personId: 'initial',
      personName: 'Initial Data',
      afterState: { name: 'Initial Data Load' },
      description: 'Initial data loaded into the system'
    }
  ],
};

// Helper function to create changelog entry
const createChangelogEntry = (
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  personId: string,
  personName: string,
  beforeState?: Partial<Person>,
  afterState?: Partial<Person>,
  description?: string
): ChangeLogEntry => {
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    action,
    personId,
    personName,
    beforeState,
    afterState,
    description: description || `${action} operation on ${personName}`
  };
};

// Helper function to recursively find a person
const findPersonRecursive = (persons: Person[], targetId: string): Person | null => {
  for (const person of persons) {
    if (person.id === targetId) {
      return person;
    }
    if (person.children) {
      const found = findPersonRecursive(person.children, targetId);
      if (found) return found;
    }
  }
  return null;
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
      state.changelog.push(createChangelogEntry(
        'UPDATE',
        'all',
        'All Data',
        undefined,
        { name: 'Bulk Data Update' },
        'Data replaced via setData action'
      ));
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addPerson: (state, action: PayloadAction<Omit<Person, 'id'>>) => {
      const newPerson: Person = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.data.push(newPerson);
      
      state.changelog.push(createChangelogEntry(
        'CREATE',
        newPerson.id,
        newPerson.name,
        undefined,
        newPerson,
        `Added new person: ${newPerson.name}`
      ));
    },
    updatePerson: (state, action: PayloadAction<Person>) => {
      const existingPerson = findPersonRecursive(state.data, action.payload.id);
      const beforeState = existingPerson ? { ...existingPerson } : undefined;
      
      state.data = updatePersonRecursive(state.data, action.payload.id, action.payload);
      
      state.changelog.push(createChangelogEntry(
        'UPDATE',
        action.payload.id,
        action.payload.name,
        beforeState,
        action.payload,
        `Updated person: ${action.payload.name}`
      ));
    },
    deletePerson: (state, action: PayloadAction<string>) => {
      const existingPerson = findPersonRecursive(state.data, action.payload);
      const beforeState = existingPerson ? { ...existingPerson } : undefined;
      
      state.data = deletePersonRecursive(state.data, action.payload);
      
      if (existingPerson) {
        state.changelog.push(createChangelogEntry(
          'DELETE',
          action.payload,
          existingPerson.name,
          beforeState,
          undefined,
          `Deleted person: ${existingPerson.name}`
        ));
      }
    },
    clearChangelog: (state) => {
      state.changelog = [];
    },
  },
});

export const { setData, setLoading, addPerson, updatePerson, deletePerson, clearChangelog } = personSlice.actions;

const store = configureStore({
  reducer: {
    person: personSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 