import axios from 'axios';
import { toast } from 'react-toastify';

const TaskCard = ({ task, fetchTasks, API_URL }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${task._id}`);
      toast.error('Task deleted permanently.');
      fetchTasks(); // Updates UI without refresh
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleStatusToggle = async (newStatus) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };

  const statusColors = {
    'Pending': 'bg-gray-100 text-gray-600 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  return (
    <div className={`bg-white p-5 rounded-xl shadow-sm border ${task.status === 'Completed' ? 'border-gray-200 opacity-75' : 'border-gray-100 hover:shadow-md'} transition-all flex flex-col sm:flex-row justify-between gap-4`}>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 className={`text-lg font-bold ${task.status === 'Completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</h3>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${priorityColors[task.priority]}`}>{task.priority}</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusColors[task.status]}`}>{task.status}</span>
        </div>
        {task.description && <p className="text-gray-600 text-sm mb-3">{task.description}</p>}
        {task.dueDate && <p className="text-xs font-semibold text-indigo-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      </div>
      
      <div className="flex sm:flex-col gap-2 justify-end min-w-[120px]">
        {task.status !== 'Completed' ? (
          <button onClick={() => handleStatusToggle('Completed')} className="flex-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold py-2 px-3 rounded-lg text-sm transition-colors border border-emerald-200">Complete</button>
        ) : (
          <button onClick={() => handleStatusToggle('Pending')} className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 font-semibold py-2 px-3 rounded-lg text-sm transition-colors border border-gray-200">Revert</button>
        )}
        <button onClick={handleDelete} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 font-semibold py-2 px-3 rounded-lg text-sm transition-colors border border-red-200">Delete</button>
      </div>
    </div>
  );
};
export default TaskCard;