import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskForm = ({ fetchTasks, API_URL }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Frontend Validation
    if (!formData.title.trim()) {
      toast.warn('Task title is mandatory!');
      return;
    }

    try {
      await axios.post(API_URL, formData);
      toast.success('Task successfully created!');
      setFormData({ title: '', description: '', status: 'Pending', priority: 'Medium', dueDate: '' });
      fetchTasks(); // Fetch fresh data without reloading the page
    } catch (error) {
      toast.error('Failed to create task.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-8">
      <h2 className="text-xl font-extrabold mb-5 text-gray-800 border-b pb-2">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="E.g., Deploy Backend API" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none h-24 bg-gray-50 focus:bg-white" placeholder="Brief details about the task..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white cursor-pointer">
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white cursor-pointer">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 focus:bg-white cursor-pointer" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md mt-2">Create Task</button>
      </form>
    </div>
  );
};
export default TaskForm;