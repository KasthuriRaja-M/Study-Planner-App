import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    subject: '',
    dueDate: '',
    priority: 'medium',
    description: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('studyTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    const task = {
      id: uuidv4(),
      ...newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      subject: '',
      dueDate: '',
      priority: 'medium',
      description: ''
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    if (!editingTask.title.trim()) return;
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const cancelEdit = () => {
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="text-center mb-3">
          <h1>📚 Study Planner App</h1>
          <p>Organize your studies efficiently and stay on track!</p>
        </header>

        {/* Add New Task Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Add New Study Task</h2>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                value={newTask.subject}
                onChange={(e) => setNewTask({...newTask, subject: e.target.value})}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <input
                type="date"
                className="form-control"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Description (optional)"
              rows="3"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
          </div>
          <button className="btn btn-primary" onClick={addTask}>
            <FaPlus /> Add Task
          </button>
        </div>

        {/* Filter Controls */}
        <div className="card">
          <div className="d-flex justify-content-between align-items-center">
            <h3>Your Tasks ({filteredTasks.length})</h3>
            <div className="filter-controls">
              <button 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('pending')}
              >
                Pending
              </button>
              <button 
                className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="card text-center">
            <p>No tasks found. Add your first study task above!</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              {editingTask?.id === task.id ? (
                // Edit Mode
                <div className="edit-mode">
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editingTask.subject}
                    onChange={(e) => setEditingTask({...editingTask, subject: e.target.value})}
                  />
                  <input
                    type="date"
                    className="form-control mb-2"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                  />
                  <select
                    className="form-control mb-2"
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <textarea
                    className="form-control mb-2"
                    rows="2"
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                  />
                  <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={saveEdit}>
                      <FaCheck /> Save
                    </button>
                    <button className="btn btn-danger" onClick={cancelEdit}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="task-content">
                  <div className="task-header">
                    <div className="task-title-section">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task.id)}
                        className="task-checkbox"
                      />
                      <h3 className={task.completed ? 'completed-text' : ''}>
                        {task.title}
                      </h3>
                    </div>
                    <div className="task-actions">
                      <button 
                        className="btn btn-outline"
                        onClick={() => startEditing(task)}
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="task-details">
                    <div className="task-meta">
                      <span className="task-subject">{task.subject}</span>
                      <span 
                        className="task-priority"
                        style={{ backgroundColor: getPriorityColor(task.priority) }}
                      >
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="task-date">
                          Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Statistics */}
        <div className="card">
          <h3>Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tasks.filter(t => !t.completed).length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{tasks.filter(t => t.completed).length}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
              </span>
              <span className="stat-label">Completion Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
