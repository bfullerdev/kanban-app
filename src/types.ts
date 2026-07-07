export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  subtasks: Subtask[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  tasks: Task[];
}
