import React from 'react'; // Import React to use JSX
import { ListPlus, List } from 'lucide-react'; // Import icons from lucide-react library

// SideMenu component that accepts an `onSelect` prop to switch between views
function SideMenu({ onSelect }) {
  return (
    // Sidebar container with:
    // d-flex flex-column: flex layout in vertical direction
    // bg-light: light background color
    // p-3: padding
    // border-end: right border
    // style: fixed minimum width and full height
    <div className="d-flex flex-column bg-light p-3 border-end" style={{ minWidth: '200px', height: '100vh' }}>
      
      {/* Vertical navigation menu */}
      <nav className="nav flex-column">

        {/* Menu item for "Add Task" */}
        <a
          className="nav-link d-flex align-items-center gap-2" // Flex row with spacing between icon and text
          onClick={() => onSelect('add')} // Call onSelect with 'add' when clicked
          style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickability
        >
          <ListPlus size={18} /> {/* Add icon */}
          Add Task
        </a>

        {/* Menu item for "List Tasks" */}
        <a
          className="nav-link d-flex align-items-center gap-2"
          onClick={() => onSelect('list')} // Call onSelect with 'list' when clicked
          style={{ cursor: 'pointer' }}
        >
          <List size={18} /> {/* List icon */}
          List Tasks
        </a>
      </nav>
    </div>
  );
}

export default SideMenu; 
