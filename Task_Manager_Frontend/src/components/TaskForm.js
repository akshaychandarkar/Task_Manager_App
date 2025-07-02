// Import React and hooks needed to manage state and side effects
import React, { useState, useEffect } from 'react';
// Import toast for user notifications
import { toast } from 'react-toastify';

// Define the TaskForm component, accepting props to add/update tasks, edit mode, and cancel action
function TaskForm({ addTask, updateTask, taskToEdit, onCancel }) {
  // Allowed values for Story Stats checkboxes
  const allowedStoryStats = ['Development', 'Unit Testing', 'Dev Testing', 'Deployment'];

  // Define the state for the form fields (formData) with default empty values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    worklog: '',
    priority: '',
    storyStats: [],
  });

  // State to store field validation errors
  const [errors, setErrors] = useState({});
  // State to know if the form was submitted, for showing validation asterisks
  const [submitted, setSubmitted] = useState(false);

  // When editing a task, load its data into the form, cleaning storyStats to match allowed options
  useEffect(() => {
    if (taskToEdit) {
      const cleanStats = (taskToEdit.storyStats || []).filter((s) =>
        allowedStoryStats.includes(s)
      );
      setFormData({ ...taskToEdit, storyStats: cleanStats });
    }
  }, [taskToEdit]);

  // Handle changes to form inputs: updates formData state
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      // Update storyStats array for checkboxes
      const updated = checked
        ? [...formData.storyStats, value]
        : formData.storyStats.filter((s) => s !== value);
      setFormData({ ...formData, storyStats: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Validate the form fields; set errors if invalid and return whether form is valid
  const validate = () => {
    const errs = {};
    const titleRegex = /^[a-zA-Z0-9_\-: ]+$/;

    // Title: must be non-empty & match regex
    if (!formData.title || !titleRegex.test(formData.title.trim())) errs.title = true;
    // Description: must be non-empty
    if (!formData.description.trim()) errs.description = true;
    // Start Date: must be selected
    if (!formData.startDate) errs.startDate = true;
    // End Date: must be selected
    if (!formData.endDate) errs.endDate = true;
    // Dates logic: start must not be after end
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      toast.error('Start date cannot be after end date');
      errs.startDate = true;
      errs.endDate = true;
    }
    // Worklog: must be non-empty
    if (!formData.worklog.trim()) errs.worklog = true;
    // Priority: must be selected
    if (!formData.priority) errs.priority = true;
    // Story Stats: at least one checkbox should be selected
    if (formData.storyStats.length === 0) errs.storyStats = true;

    setErrors(errs);
    if (Object.keys(errs).length > 0) toast.error('Please correct the highlighted fields.');
    return Object.keys(errs).length === 0;
  };

  // Handle form submission: validate & call addTask or updateTask
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (validate()) {
      const trimmedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        worklog: formData.worklog.trim(),
      };
      if (taskToEdit) {
        updateTask(trimmedData);
      } else {
        addTask(trimmedData);
      }
    }
  };

  // Handle reset: clear the form back to initial state
  const handleReset = () => {
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      status: 'Not Started',
      worklog: '',
      priority: '',
      storyStats: [],
    });
    setErrors({});
    setSubmitted(false);
  };

  // Helper to render field label with optional error asterisk if invalid
  const label = (key, text) => (
    <>
      {text} {submitted && errors[key] && <span className="text-danger">*</span>}
    </>
  );

  return (
    <div className="card bg-white p-4 shadow-sm">
      <form onSubmit={handleSubmit}>
        {/* Title input */}
        <div className="mb-3">
          <label className="form-label">{label('title', 'Title')}</label>
          <input
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description input */}
        <div className="mb-3">
          <label className="form-label">{label('description', 'Description')}</label>
          <textarea
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Start and End Dates */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{label('startDate', 'Start Date')}</label>
            <input
              type="date"
              className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
              name="startDate"
              value={formData.startDate?.split('T')[0] || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">{label('endDate', 'End Date')}</label>
            <input
              type="date"
              className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
              name="endDate"
              value={formData.endDate?.split('T')[0] || ''}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Status and Worklog inputs */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">{label('status', 'Status')}</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">{label('worklog', 'Worklog')}</label>
            <input
              className={`form-control ${errors.worklog ? 'is-invalid' : ''}`}
              name="worklog"
              value={formData.worklog}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Priority radio buttons */}
        <div className="mb-3">
          <label className="form-label">{label('priority', 'Priority')}</label>
          <div className="d-flex gap-3">
            {['High', 'Medium', 'Low'].map((p) => (
              <label key={p} className={errors.priority ? 'is-invalid' : ''}>
                <input
                  type="radio"
                  name="priority"
                  value={p}
                  checked={formData.priority === p}
                  onChange={handleChange}
                />{' '}
                {p}
              </label>
            ))}
          </div>
        </div>

        {/* Story Stats checkboxes */}
        <div className="mb-3">
          <label className="form-label">{label('storyStats', 'Story Stats')}</label>
          <div className="d-flex gap-3 flex-wrap">
            {allowedStoryStats.map((s) => (
              <label key={s} className={errors.storyStats ? 'is-invalid' : ''}>
                <input
                  type="checkbox"
                  value={s}
                  checked={formData.storyStats.includes(s)}
                  onChange={handleChange}
                />{' '}
                {s}
              </label>
            ))}
          </div>
        </div>

        {/* Form buttons: Add/Update, Reset, and Cancel */}
        <button className="btn btn-success me-2" type="submit">
          {taskToEdit ? 'Update' : 'Add'} Task
        </button>
        <button className="btn btn-warning me-2" type="button" onClick={handleReset}>
          Reset
        </button>
        <button className="btn btn-secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

// Export the TaskForm so it can be used in App.js
export default TaskForm;
