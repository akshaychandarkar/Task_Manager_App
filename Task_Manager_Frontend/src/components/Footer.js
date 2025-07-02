// Import React library so we can write JSX components
import React from 'react';

// Define the Footer component as a simple functional component
function Footer() {
  return (
    // Return a footer element with Bootstrap classes:
    // - bg-dark: dark background
    // - text-white: white text
    // - text-center: center text horizontally
    // - py-2: vertical padding
    // - mt-auto: push footer to bottom of flex container
    <footer className="bg-dark text-white text-center py-2 mt-auto">
      {/* Display the current year dynamically using JavaScript Date object,
          followed by your app name and your name */}
      &copy; {new Date().getFullYear()} Task Manager App - Akshay Chandarkar
    </footer>
  );
}

// Export the Footer component so it can be imported in other files
export default Footer;
