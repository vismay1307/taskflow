export interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  emailVerified: boolean;
}

export interface Board {
  _id: string;
  name: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  boardId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}