const PerformanceSummary = ({ completedGoalsCount, averageProgress }) => (
  <footer className="text-center mt-8 text-gray-700">
    <p className="mb-1">
      <strong>✅ Completed Goals:</strong> {completedGoalsCount}
    </p>
    <p>
      <strong>📊 Average Progress:</strong> {averageProgress}%
    </p>
  </footer>
);

export default PerformanceSummary;
