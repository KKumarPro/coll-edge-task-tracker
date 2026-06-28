import { useEffect, useState } from 'react';

const FilterBar = ({ tasks, setFilteredTasks }) => {
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    let result = [...tasks];

    // Apply Status Filter
    if (filter !== 'All') {
      result = result.filter(task => task.status === filter);
    }

    // Apply Sorting
    if (sort === 'Newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'Oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'Due Date') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }

    setFilteredTasks(result);
  }, [tasks, filter, sort, setFilteredTasks]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-600">Status:</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border border-gray-200 rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-gray-600">Sort by:</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="border border-gray-200 rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
          <option>Newest</option>
          <option>Oldest</option>
          <option>Due Date</option>
        </select>
      </div>
    </div>
  );
};
export default FilterBar;