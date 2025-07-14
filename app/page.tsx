"use client"

import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Trash2, GripVertical } from 'lucide-react';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [previewTasks, setPreviewTasks] = useState(null);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      };
      setTasks(prev => [...prev, task]);
      setNewTask('');
      setShowAddForm(false);
    }
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const filteredTasks = (previewTasks || tasks).filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  const getFilterCount = (filterType) => {
    if (filterType === 'all') return tasks.length;
    if (filterType === 'active') return tasks.filter(task => !task.completed).length;
    if (filterType === 'completed') return tasks.filter(task => task.completed).length;
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index);
    
    if (!draggedTask) return;
    
    // Create preview of reordered tasks
    const draggedIndex = tasks.findIndex(task => task.id === draggedTask.id);
    if (draggedIndex === index) {
      setPreviewTasks(null);
      return;
    }
    
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, removed);
    setPreviewTasks(newTasks);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (!draggedTask) return;
    
    const draggedIndex = tasks.findIndex(task => task.id === draggedTask.id);
    if (draggedIndex === dropIndex) return;
    
    const newTasks = [...tasks];
    const [removed] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(dropIndex, 0, removed);
    
    setTasks(newTasks);
    setDraggedTask(null);
    setDragOverIndex(null);
    setPreviewTasks(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverIndex(null);
    setPreviewTasks(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <h1 className="text-2xl font-bold text-center mb-2">Todo App</h1>
          <p className="text-center text-purple-100">
            {completedCount} of {totalCount} tasks completed
          </p>
        </div>

        {/* Action Row */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              showAddForm 
                ? 'bg-red-500 hover:bg-red-600 text-white rotate-45' 
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            {showAddForm ? <X size={20} /> : <Plus size={20} />}
          </button>
          
          {tasks.length > 0 && (
            <button
              onClick={clearAllTasks}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Add Form */}
        <div className={`overflow-hidden transition-all duration-300 ${showAddForm ? 'max-h-32' : 'max-h-0'}`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Add a new task..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={addTask}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full p-4 flex items-center justify-between text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="font-medium">Filters</span>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-20' : 'max-h-0'}`}>
            <div className="px-4 pb-4 flex gap-2">
              {['all', 'active', 'completed'].map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                    filter === filterType
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)} ({getFilterCount(filterType)})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No tasks {filter !== 'all' ? `in ${filter}` : ''}</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md ${
                    draggedTask?.id === task.id 
                      ? 'opacity-50 scale-105 rotate-1 shadow-lg z-10 transition-all duration-200' 
                      : previewTasks ? 'transition-all duration-700 ease-in-out' : 'transition-all duration-300'
                  } ${
                    dragOverIndex === index && draggedTask?.id !== task.id
                      ? 'border-purple-400 bg-purple-50'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move">
                      <GripVertical size={16} className="text-gray-400" />
                    </div>
                    
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                    />
                    
                    {/* Task Text */}
                    <span className={`flex-1 transition-all duration-200 ${
                      task.completed 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-800'
                    }`}>
                      {task.text}
                    </span>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;