import React, { useState } from 'react';
import { Check, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Button from './Button';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string | null;
  reminder: string | null;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`border rounded-lg mb-3 overflow-hidden ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={() => onToggleComplete(task.id)}
              className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center ${
                task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}
            >
              {task.completed && <Check size={14} className="text-white" />}
            </button>
            <div className="flex-1">
              <h3
                className={`font-medium text-lg cursor-pointer ${
                  task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
                onClick={toggleExpand}
              >
                {task.title}
              </h3>
              
              {isExpanded && (
                <div className="mt-2">
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  
                  {(task.dueDate || task.reminder) && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      {task.dueDate && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {task.reminder && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>Reminder: {format(new Date(task.reminder), 'MMM d, yyyy h:mm a')}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 mt-3">
                    <Button
                      variant="secondary"
                      onClick={() => onEdit(task)}
                      className="flex items-center text-sm py-1"
                    >
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(task.id)}
                      className="flex items-center text-sm py-1"
                    >
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;