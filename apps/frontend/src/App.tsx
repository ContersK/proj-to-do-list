// src/App.tsx
import { useState, useEffect } from "react";
import { TaskItem } from "./components/TaskItems";
import { TaskForm } from "./components/TaskForm";
import { taskAPI } from "./services/api";
import type { Task, CreateTaskData, UpdateTaskData } from "./Types/Task";
import { AlertTriangle, CheckCircle, Clock, ListTodo } from "lucide-react";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  // Carregar tasks ao inicializar
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const tasksData = await taskAPI.getTasks();

      // DEBUG - vamos ver o que a API está retornando
      console.log("Dados recebidos da API:", tasksData);
      console.log("Tipo dos dados:", typeof tasksData);
      console.log("É array?", Array.isArray(tasksData));

      // Garantir que sempre seja um array
      const tasksArray = Array.isArray(tasksData) ? tasksData : [];
      setTasks(tasksArray);
    } catch (err) {
      setError("Erro ao carregar tasks. Verifique se o backend está rodando.");
      console.error("Erro ao carregar tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      const newTask = await taskAPI.createTask(data);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError("Erro ao criar task");
      console.error("Erro ao criar task:", err);
    }
  };

  const handleUpdateTask = async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskAPI.updateTask(id, data);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError("Erro ao atualizar task");
      console.error("Erro ao atualizar task:", err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta task?")) return;

    try {
      await taskAPI.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError("Erro ao deletar task");
      console.error("Erro ao deletar task:", err);
    }
  };

  const handleToggleTask = async (id: string) => {
    try {
      const updatedTask = await taskAPI.toggleTask(id);
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError("Erro ao alterar status da task");
      console.error("Erro ao toggle task:", err);
    }
  };

  // Filtrar tasks
  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "pending":
        return !task.completed;
      case "completed":
        return task.completed;
      default:
        return true;
    }
  });

  // Estatísticas
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Carregando tasks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <ListTodo className="text-blue-500" />
            Task Manager
          </h1>
          <p className="text-gray-600">
            Gerencie suas tarefas com nossa API CRUD completa
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertTriangle size={20} />
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <ListTodo className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-500" size={24} />
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {pendingTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-500" size={24} />
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "all"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Todas ({totalTasks})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pendentes ({pendingTasks})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === "completed"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Concluídas ({completedTasks})
          </button>
        </div>

        {/* Task Form */}
        <div className="mb-8">
          <TaskForm onSubmit={handleCreateTask} />
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">
                {filter === "all"
                  ? "Nenhuma task encontrada. Crie sua primeira!"
                  : `Nenhuma task ${
                      filter === "pending" ? "pendente" : "concluída"
                    } encontrada.`}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleTask}
              />
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={loadTasks}
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Recarregar Tasks
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
