const ProgressModal = ({ newProgress, onChange, onClose, onSave }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-80 shadow-xl">
      <h2 className="text-2xl font-semibold mb-4">Update Progress</h2>
      <input
        type="number"
        value={newProgress}
        onChange={onChange}
        min="0"
        max="100"
        className="w-full border p-3 rounded focus:outline-none"
      />
      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default ProgressModal;
