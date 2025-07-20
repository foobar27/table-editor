export interface Person {
  id: string;
  name: string;
  age: number;
  status: 'active' | 'inactive';
  children?: Person[];
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  personId: string;
  personName: string;
  beforeState?: Partial<Person>;
  afterState?: Partial<Person>;
  description: string;
}
