import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FiTarget } from "react-icons/fi";

const API_BASE_URL = "http://127.0.0.1:8000/api/goals";

const GoalTracker = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(null);
  const [newProgress, setNewProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  }, []);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      setGoals(response.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to fetch goals. Please try again later.");
      alert("Failed to fetch goals. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleInputChange = (e) => {
    setNewGoal(e.target.value);
  };

  const addGoal = async () => {
    if (newGoal.trim() === "") return;
    try {
      const response = await axios.post(
        API_BASE_URL,
        { name: newGoal, progress: 0 },
        { headers: getAuthHeaders() },
      );
      setGoals((prevGoals) => [...prevGoals, response.data]);
      setNewGoal("");
    } catch (err) {
      console.error("Error adding goal:", err);
      setError("Failed to add goal. Please try again.");
      alert("Failed to add goal. Please try again.");
    }
  };

  const updateGoalProgress = async () => {
    if (selectedGoalIndex === null) return;

    const updatedGoal = { ...goals[selectedGoalIndex] };
    updatedGoal.progress = Math.max(
      0,
      Math.min(100, parseInt(newProgress, 10)),
    );

    try {
      await axios.put(`${API_BASE_URL}/${updatedGoal.id}`, updatedGoal, {
        headers: getAuthHeaders(),
      });
      setGoals((prevGoals) =>
        prevGoals.map((goal, index) =>
          index === selectedGoalIndex ? updatedGoal : goal,
        ),
      );
      closeModal();
    } catch (err) {
      console.error("Error updating goal:", err);
      setError("Failed to update goal. Please try again.");
      alert("Failed to update goal. Please try again.");
    }
  };

  const deleteGoal = async (index) => {
    const goalId = goals[index].id;
    try {
      await axios.delete(`${API_BASE_URL}/${goalId}`, {
        headers: getAuthHeaders(),
      });
      setGoals((prevGoals) => prevGoals.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting goal:", err);
      setError("Failed to delete goal. Please try again.");
      alert("Failed to delete goal. Please try again.");
    }
  };

  const openModal = (index) => {
    setIsModalOpen(true);
    setSelectedGoalIndex(index);
    setNewProgress(goals[index].progress);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGoalIndex(null);
  };

  const handleProgressChange = (e) => {
    setNewProgress(e.target.value);
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPerformanceSummary = useCallback(() => {
    if (!goals.length) return { completedGoalsCount: 0, averageProgress: 0 };
    const completedGoals = goals.filter((goal) => goal.progress >= 100);
    const totalProgress = goals.reduce((acc, goal) => acc + goal.progress, 0);
    const averageProgress =
      goals.length > 0 ? Math.round(totalProgress / goals.length) : 0;
    return {
      completedGoalsCount: completedGoals.length,
      averageProgress,
    };
  }, [goals]);

  const { completedGoalsCount, averageProgress } = getPerformanceSummary();

  if (loading) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">Loading goals...</div>
    );
  }
  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3 text-gray-800">
          <FiTarget className="text-green-500" /> Goal Tracker
        </h1>
        <p className="text-gray-600 mt-2">Stay on track with your progress</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={newGoal}
          onChange={handleInputChange}
          placeholder="Enter a new goal"
          className="flex-grow border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition duration-200"
        />
        <button
          onClick={addGoal}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200 transition duration-200"
        >
          Add Goal
        </button>
      </div>

      <div className="space-y-5">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <div
              key={goal.id}
              className="p-5 bg-white border border-gray-200 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-semibold text-gray-800">
                  {goal.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => openModal(index)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteGoal(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 transition duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getProgressColor(goal.progress)} transition-all duration-300`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-gray-600">Progress: {goal.progress}%</p>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            No goals added yet. Start by adding one!
          </div>
        )}
      </div>

      {isModalOpen && selectedGoalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80 transform transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Update Progress
            </h2>
            <input
              type="number"
              value={newProgress}
              onChange={handleProgressChange}
              min="0"
              max="100"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition duration-200"
            />
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={updateGoalProgress}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="text-center mt-8 text-gray-700">
        <p className="mb-1">
          <span className="font-semibold">✅ Completed Goals:</span>{" "}
          {completedGoalsCount}
        </p>
        <p>
          <span className="font-semibold">📊 Average Progress:</span>{" "}
          {averageProgress}%
        </p>
      </footer>
    </div>
  );
};

export default GoalTracker;
