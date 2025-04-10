const PerformanceSummary = ({ completedGoalsCount, averageProgress, t }) => (
  <footer className="text-center mt-8 text-gray-700">
    <p className="mb-1">
      <strong>✅ {t("performance.completed")}:</strong> {completedGoalsCount}
    </p>
    <p>
      <strong>📊 {t("performance.average")}:</strong> {averageProgress}%
    </p>
  </footer>
);

export default PerformanceSummary;
