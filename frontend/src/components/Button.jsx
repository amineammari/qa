function Button({ children, onClick, type = 'button', variant = 'primary', disabled, ...props }) {
  const baseClasses = 'px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

