import axios from "axios";
import type { CreateTaskData, UpdateTaskData } from "../Types/Task";
import type { Task } from "../Types/Task";

const api = axios.create({
  baseURL: import.meta.env.baseURL || "http://localhost:3001/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const taskAPI = {
  // Buscar todas as tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>("/tasks");
    return response.data;
  },

  // Buscar task por ID
  getTask: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Criar nova task
  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await api.post<Task>("/tasks", data);
    return response.data;
  },

  // Atualizar task
  updateTask: async (id: string, data: UpdateTaskData): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  // Deletar task
  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  // Toggle completed status
  toggleTask: async (id: string): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}/toggle`);
    return response.data;
  },
};

export default api;
