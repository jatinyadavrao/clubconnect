
import { FaSpinner } from 'react-icons/fa';

const Loading = () => {
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-5">
      <FaSpinner className="animate-spin text-white text-4xl" />
    </div>
  );
};

export default Loading;
