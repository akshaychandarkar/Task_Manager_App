// Import React library so we can write JSX components
import React from 'react';

// Define the Header component as a simple functional component
function Header() {
  return (
    // Return a header element with Bootstrap classes:
    // - bg-primary: blue background
    // - text-white: white text
    // - d-flex justify-content-center align-items-center: center content horizontally and vertically
    // - px-3 py-2: padding on X and Y axis
    <header className="bg-primary text-white d-flex justify-content-center align-items-center px-3 py-2">
      {/* Display the app title inside an h1 element with no margin */}
      <h1 className="m-0">Task Manager</h1>
    </header>
  );
}

// Export the Header component so it can be imported in other files
export default Header;
