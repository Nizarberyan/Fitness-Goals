const GoalItem = ({ goal, index, onUpdate, onDelete, getColor, t }) => (
  <div className="p-5 bg-white border rounded-lg shadow">
    <div className="flex justify-between items-center mb-3">
      <span className="text-xl font-semibold">{goal.name}</span>
      <div className="space-x-2">
        <button
          onClick={() => onUpdate(index)}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          {t("buttons.update")}
        </button>
        <button
          onClick={() => onDelete(index)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          {t("buttons.delete")}
        </button>
      </div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full rounded-full ${getColor(goal.progress)} transition-all duration-300`}
        style={{ width: `${goal.progress}%` }}
      />
    </div>
    <p className="mt-2 text-gray-600">
      {t("performance.progress")}: {goal.progress}%
    </p>
  </div>
);

export default GoalItem;
