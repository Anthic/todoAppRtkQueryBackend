export interface ITodo {
  id: number;
  title: string;
  image: string | null;
  imagePublicId?: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoDTO {
  title: string;
  image?: string;
}

export interface UpdateTodoDTO {
  title?: string;
  image?: string;
  completed?: boolean;
}
