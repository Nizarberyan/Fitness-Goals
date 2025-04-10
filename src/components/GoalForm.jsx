const GoalForm = ({ newGoal, onChange, onAdd, t }) => (
  <div className="flex flex-col sm:flex-row gap-4">
    <input
      type="text"
      value={newGoal}
      onChange={onChange}
      placeholder={t("formPlaceholder")}
      className="flex-grow border p-3 rounded focus:outline-none focus:ring-2"
    />
    <button
      onClick={onAdd}
      className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
    >
      {t("buttons.addGoal")}
    </button>
  </div>
);

export default GoalForm;
