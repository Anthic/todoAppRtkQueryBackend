export interface ITodo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDTO {
  title: string;
}

export interface UpdateTodoDTO {
  title?: string;
  completed?: boolean;
}