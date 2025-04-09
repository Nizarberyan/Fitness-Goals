import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { FiTarget } from "react-icons/fi";
import GoalForm from "./components/GoalForm";
import GoalItem from "./components/GoalItem";
import ProgressModal from "./components/ProgressModal";
import PerformanceSummary from "./components/PerformanceSummary";

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

      <GoalForm
        newGoal={newGoal}
        onChange={handleInputChange}
        onAdd={addGoal}
      />

      <div className="space-y-5">
        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <GoalItem
              key={goal.id}
              goal={goal}
              index={index}
              onUpdate={openModal}
              onDelete={deleteGoal}
              getColor={getProgressColor}
            />
          ))
        ) : (
          <div className="text-center text-gray-500">
            No goals added yet. Start by adding one!
          </div>
        )}
      </div>

      {isModalOpen && selectedGoalIndex !== null && (
        <ProgressModal
          newProgress={newProgress}
          onChange={handleProgressChange}
          onClose={closeModal}
          onSave={updateGoalProgress}
        />
      )}

      <PerformanceSummary
        completedGoalsCount={completedGoalsCount}
        averageProgress={averageProgress}
      />
    </div>
  );
};

export default GoalTracker;
