import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';
import FilterBar from './components/FilterBar';

// Environment variables will be used for production, local for now.
const API_URL = 'https://coll-edge-task-tracker.onrender.com/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
      // The FilterBar component will handle updating filteredTasks automatically via its useEffect
    } catch (error) {
      console.error("Critical error: Failed to fetch tasks from the engine.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-indigo-700 tracking-tight">COLL-EDGE <span className="text-gray-800">CONNECT</span></h1>
          <p className="text-gray-500 mt-3 font-medium text-lg">Engineering Assessment — Task Tracker System</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <TaskForm fetchTasks={fetchTasks} API_URL={API_URL} />
          </div>
          
          {/* Right Column: Filters and Task List */}
          <div className="lg:col-span-2 space-y-5">
            <FilterBar tasks={tasks} setFilteredTasks={setFilteredTasks} />
            
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                 <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-sm border border-gray-100 border-dashed border-2">
                   <p className="text-xl font-semibold">No tasks found.</p>
                   <p className="text-sm mt-1">Adjust your filters or create a new task to begin.</p>
                 </div>
              ) : (
                 filteredTasks.map(task => (
                   <TaskCard key={task._id} task={task} fetchTasks={fetchTasks} API_URL={API_URL} />
                 ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Universal Notification System */}
      <ToastContainer position="bottom-right" autoClose={2500} theme="colored" />
    </div>
  );
}
export default App;