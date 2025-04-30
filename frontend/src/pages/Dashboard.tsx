import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import TaskItem, { Task } from '../components/TaskItem';
import { useTasks } from '../context/TaskContext';
import { format } from 'date-fns';

interface TaskFormData {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
  reminder: string;
}

const Dashboard: React.FC = () => {
  const { tasks, loading, getTasks, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    dueDate: '',
    reminder: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      reminder: '',
    });
    setIsEditing(false);
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && formData.id) {
        await updateTask(formData.id, {
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate || null,
          reminder: formData.reminder || null,
        });
      } else {
        await createTask({
          title: formData.title,
          description: formData.description,
          completed: false,
          dueDate: formData.dueDate || null,
          reminder: formData.reminder || null,
        });
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task: Task) => {
    setFormData({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || '',
      reminder: task.reminder || '',
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    })
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Group tasks by due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const overdueTask = filteredTasks.filter((task) => 
    task.dueDate && new Date(task.dueDate) < today && !task.completed
  );

  const todayTasks = filteredTasks.filter((task) => 
    task.dueDate && new Date(task.dueDate).toDateString() === today.toDateString()
  );

  const tomorrowTasks = filteredTasks.filter((task) => 
    task.dueDate && new Date(task.dueDate).toDateString() === tomorrow.toDateString()
  );

  const upcomingTasks = filteredTasks.filter((task) => 
    task.dueDate && 
    new Date(task.dueDate) > tomorrow && 
    new Date(task.dueDate) <= nextWeek
  );

  const laterTasks = filteredTasks.filter((task) => 
    !task.dueDate || new Date(task.dueDate) > nextWeek
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <Button onClick={openModal} className="flex items-center">
            <Plus size={18} className="mr-1" /> Add Task
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                className={`px-3 py-2 rounded-md ${
                  filter === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-2 rounded-md ${
                  filter === 'active'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('active')}
              >
                Active
              </button>
              <button
                className={`px-3 py-2 rounded-md ${
                  filter === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No tasks found</p>
            <Button onClick={openModal} className="mt-4">
              Create your first task
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {overdueTask.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <AlertCircle size={18} className="text-red-500 mr-2" />
                  <h2 className="text-lg font-medium text-red-600">Overdue</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {overdueTask.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {todayTasks.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <CheckCircle size={18} className="text-blue-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Today</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {todayTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {tomorrowTasks.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Circle size={18} className="text-purple-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Tomorrow</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {tomorrowTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {upcomingTasks.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Circle size={18} className="text-green-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Upcoming (Next 7 days)</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {upcomingTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}

            {laterTasks.length > 0 && (
              <div>
                <div className="flex items-center mb-2">
                  <Circle size={18} className="text-gray-500 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">Later</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {laterTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Task' : 'Add New Task'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    id="dueDate"
                    name="dueDate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 mb-1">
                    Reminder
                  </label>
                  <input
                    type="datetime-local"
                    id="reminder"
                    name="reminder"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.reminder}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {isEditing ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;