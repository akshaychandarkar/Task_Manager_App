import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './DeleteConfirmModal.css'; // Custom CSS for tick animation

// DeleteConfirmModal Component
// Props:
// - show: boolean to control modal visibility
// - onHide: function to close the modal
// - onConfirm: function to execute actual deletion logic
function DeleteConfirmModal({ show, onHide, onConfirm }) {
  const [deleting, setDeleting] = useState(false); // Internal state to show "deleting" animation

  // Called when user confirms deletion
  const handleDelete = () => {
    setDeleting(true); // Trigger deleting animation
    setTimeout(() => {
      onConfirm();      // Call the parent’s delete handler
      setDeleting(false); // Reset state (in case modal is reused)
    }, 2000); // Simulate 2-second delay for animation
  };

  return (
    <Modal
      show={show}
      onHide={!deleting ? onHide : null} // Disable closing while deleting
      centered
      backdrop="static" // Prevent closing by clicking outside
    >
      {/* Modal Header */}
      <Modal.Header closeButton={!deleting}>
        {/* Show title only when not deleting */}
        {!deleting && <Modal.Title>Confirmation</Modal.Title>}
      </Modal.Header>

      {/* Modal Body */}
      <Modal.Body className="text-center">
        {deleting ? (
          // Animation shown during "deleting" state
          <>
            <div className="tick-container mb-4">
              <div className="tick-circle">
                <i className="fas fa-check tick-icon"></i> {/* Font Awesome animated checkmark */}
              </div>
            </div>
            <p className="fw-bold text-dark fs-5">Deleting task...</p>
          </>
        ) : (
          // Confirmation prompt before deletion
          <p className="fw-bold text-secondary">
            Are you sure you want to delete this task?
          </p>
        )}
      </Modal.Body>

      {/* Modal Footer with action buttons (only when not deleting) */}
      <Modal.Footer>
        {!deleting && (
          <>
            <Button variant="secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteConfirmModal;
