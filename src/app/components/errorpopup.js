const ErrorPopup = (props) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-red-600">Error</h3>
          <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={props.handleCloseError}>
            
            &times;
          </button>
        </div>
        
        <p className="text-gray-700">
          {props.text}
          <br/>
         <span className="text-red-500 font-serif font-bold text-lg"> Thanks.</span>
        </p>
        <div className="flex justify-end">
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" onClick={props.handleCloseError}>
            Close
          </button>
        </div>
      </div>
    </div>
    
    );
  };
  
  export default ErrorPopup;
  