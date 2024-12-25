function Spinner({ className = "", size = "h-6 w-6" }) {
  return (
    <div
      className={`animate-spin rounded-full border-4 border-t-4 border-gray-400 border-t-transparent ${size} ${className}`}
    />
  );
}

export default Spinner;
