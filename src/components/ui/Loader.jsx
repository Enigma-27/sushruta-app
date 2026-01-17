import React from 'react';

const Loader = ({ size = "md", color = "white" }) => {
  // Map size props to Tailwind classes
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-12 w-12 border-4"
  };

  // Map color props to border colors
  // Note: border-t-transparent creates the "spinning" effect
  const colorClass = color === "blue" ? "border-blue-600" : "border-white";

  return (
    <div className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${colorClass}`}></div>
  );
};

export default Loader;