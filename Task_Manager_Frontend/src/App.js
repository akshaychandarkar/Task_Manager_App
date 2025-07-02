// Import React and required hooks
import React, { useState, useEffect, useCallback } from 'react';
// Import layout components
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import Footer from './components/Footer';
// Import form and list components
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
// Import modal for delete confirmation
import DeleteConfirmModal from './components/DeleteConfirmModal';
// Import Toast for notifications
import { ToastContainer, toast } from 'react-toastify';
// Import Toastify styles
import 'react-toastify/dist/ReactToastify.css';
// Import FontAwesome for icons
import '@fortawesome/fontawesome-free/css/all.min.css';
// Import API helper (Axios instance)
import api from './api';

function App() {
  // State to control which view is shown: 'list' or 'add'
  const [view, setView] = useState('list');
  // State to store fetched tasks
  const [tasks, setTasks] = useState([]);
  // State to store total pages for pagination
  const [totalPages, setTotalPages] = useState(1);
  // State to store ID of the task selected for deletion
  const [deleteId, setDeleteId] = useState(null);
  // State to store task currently being edited
  const [editTask, setEditTask] = useState(null);
  // State to show loading spinner
  const [loading, setLoading] = useState(true);
  // State to track current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // State to track selected status filter
  const [statusFilter, setStatusFilter] = useState('');
  // Constant page size (number of tasks per page)
  const [pageSize] = useState(10);

  // Helper function: Returns user-friendly error messages from API errors
  const getErrorMessage = (error) => {
    if (!error.response) return 'Server not reachable.';
    const status = error.response.status;
    const data = error.response.data;
    if (status === 400) return 'Bad request. Please check your data.';
    if (status === 404) return 'Resource not found.';
    if (status === 500) return 'Internal server error.';
    return typeof data === 'string' ? data : 'Something went wrong.';
  };

  // Function to fetch tasks from backend API
  const fetchTasks = useCallback(() => {
    setLoading(true); // Start loading spinner
    const params = { page: currentPage, pageSize };
    if (statusFilter) params.status = statusFilter; // Apply status filter if set

    api.get('/Tasks', { params })
      .then((response) => {
        const data = response.data;
        // Store tasks or empty array if not present
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        // Store total number of pages
        setTotalPages(data.totalPages || 1);
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        toast.error(`Failed to load tasks. ${getErrorMessage(error)}`);
        setTasks([]);
        setTotalPages(1);
      })
      .finally(() => setLoading(false)); // Stop loading spinner
  }, [currentPage, statusFilter, pageSize]);

  // Call fetchTasks when component mounts or dependencies change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Function to add a new task via API
  const addTask = (task) => {
    api.post('/Tasks', task)
      .then(() => {
        toast.success('Task added successfully!');
        setView('list'); // Go back to list view
        fetchTasks();    // Reload tasks
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        toast.error(`Add failed. ${getErrorMessage(error)}`);
      });
  };

  // Function to update an existing task via API
  const updateTask = (updatedTask) => {
    api.put(`/Tasks/${updatedTask.id}`, updatedTask)
      .then(() => {
        toast.success('Task updated successfully!');
        setEditTask(null);   // Clear edit state
        setView('list');     // Return to list view
        fetchTasks();        // Refresh tasks
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        toast.error(`Update failed. ${getErrorMessage(error)}`);
      });
  };

  // Function to show delete confirmation modal
  const confirmDeleteTask = (id) => setDeleteId(id);

  // Function to actually delete the task after confirmation
  const deleteTask = () => {
    api.delete(`/Tasks/${deleteId}`)
      .then(() => {
        toast.info('Task deleted');
        setDeleteId(null);   // Close confirmation modal
        fetchTasks();        // Refresh task list
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        toast.error(`Delete failed. ${getErrorMessage(error)}`);
      });
  };

  // Function to handle edit button click: open form with task data
  const handleEdit = (task) => {
    setEditTask(task);
    setView('add');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* App header */}
      <Header />
      <div className="d-flex flex-grow-1">
        {/* Sidebar menu */}
        <SideMenu onSelect={(v) => { setView(v); setEditTask(null); }} />
        <div className="flex-grow-1 p-3">
          {/* Show spinner if loading */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : view === 'add' ? (
            // Show task form for add/edit
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              taskToEdit={editTask}
              onCancel={() => { setEditTask(null); setView('list'); }}
            />
          ) : (
            // Show task list
            <TaskList
              tasks={tasks}
              deleteTask={confirmDeleteTask}
              onEdit={handleEdit}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              pageSize={pageSize}
            />
          )}
        </div>
      </div>
      {/* App footer */}
      <Footer />
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={1500}
        closeOnClick
        pauseOnHover={false}
        draggable={false}
      />
      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        show={!!deleteId}
        onHide={() => setDeleteId(null)}
        onConfirm={deleteTask}
      />
    </div>
  );
}

export default App;
