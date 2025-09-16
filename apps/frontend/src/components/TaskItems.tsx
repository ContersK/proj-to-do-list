// src/components/TaskItem.tsx
import React, { useState } from "react";
import { Check, Edit2, Trash2, Save, XCircle } from "lucide-react";
import type { Task, UpdateTaskData } from "../Types/Task";

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, data: UpdateTaskData) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdate,
  onDelete,
  onToggle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(
    task.description || ""
  );

  const handleSave = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Checkbox para toggle */}
        <button
          onClick={() => onToggle(task.id)}
          className={`flex items-center justify-center w-5 h-5 rounded border-2 transition-colors ${
            task.completed
              ? "bg-green-500 border-green-500 text-white"
              : "border-gray-300 hover:border-green-400"
          }`}
        >
          {task.completed && <Check size={12} />}
        </button>

        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título da task"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Descrição (opcional)"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1"
                >
                  <Save size={14} />
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-1"
                >
                  <XCircle size={14} />
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3
                className={`font-medium ${
                  task.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-sm ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {task.description}
                </p>
              )}
              <div className="text-xs text-gray-400">
                Criada em:{" "}
                {new Date(task.createdAt).toLocaleDateString("pt-BR")}
              </div>
            </div>
          )}
        </div>

        {/* Botões de ação */}
        {!isEditing && (
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
