// Import React to build the component
import React from 'react';
// Import optional custom CSS for TaskList styles
import './TaskList.css'; 

// Helper function to format date & time for createdAt in IST timezone
function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });
}

// Helper function to format date-only fields (startDate, endDate) in IST
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });
}

// Main component to render task list with filters, pagination, and actions
function TaskList({
  tasks,           // Array of tasks to display
  deleteTask,      // Function to delete a task
  onEdit,          // Function to start editing a task
  currentPage,     // Current pagination page
  setCurrentPage,  // Function to set current page
  totalPages,      // Total pages available
  statusFilter,    // Current selected status filter
  setStatusFilter, // Function to set status filter
  pageSize         // Number of tasks per page
}) {
  // If no tasks, display "No Record Found!" message centered on screen
  if (!tasks || tasks.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <h2 className="text-center text-muted">No Record Found!</h2>
      </div>
    );
  }

  // Helper to return bootstrap badge class based on task status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed': return 'bg-success';
      case 'In Progress': return 'bg-warning text-dark';
      case 'Not Started': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  // Handle change in status filter dropdown: updates filter and resets to page 1
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Filter section: Dropdown to filter by task status */}
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <h5 className="mb-0 text-primary fw-bold">Task List</h5>
        <select className="form-select w-auto" value={statusFilter} onChange={handleStatusChange}>
          <option value="">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th className="bg-primary text-white">Sr. No.</th>
            <th className="bg-primary text-white">Title</th>
            <th className="bg-primary text-white">Description</th>
            <th className="bg-primary text-white">Start</th>
            <th className="bg-primary text-white">End</th>
            <th className="bg-primary text-white">Status</th>
            <th className="bg-primary text-white">Created</th>
            <th className="bg-primary text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <tr key={task.id}>
              {/* Serial number calculated based on page */}
              <td>{(currentPage - 1) * pageSize + i + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{formatDate(task.startDate)}</td>
              <td>{formatDate(task.endDate)}</td>
              <td>
                {/* Badge showing status */}
                <span className={`badge ${getStatusBadge(task.status)}`}>{task.status}</span>
              </td>
              <td>{formatDateTime(task.createdAt)}</td>
              <td>
                {/* Edit button */}
                <button className="btn btn-sm btn-warning me-2" onClick={() => onEdit(task)}>
                  <i className="fas fa-edit"></i>
                </button>
                {/* Delete button */}
                <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
        {/* Previous button */}
        <button
          className={`circle-btn ${currentPage === 1 ? 'disabled' : ''}`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        {/* Current page indicator */}
        <span className="fw-bold">{currentPage}</span>

        {/* Next button */}
        <button
          className={`circle-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

// Export TaskList for use in App.js
export default TaskList;
