import { Component } from 'react';
import axios from 'axios';

class GoalTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: [],
            newGoal: '',
            isModalOpen: false,
            selectedGoalIndex: null,
            newProgress: 0
        };
    }

    componentDidMount() {
        this.fetchGoals();
    }

    getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`
        };
    };

    fetchGoals = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/goals`, {
                headers: this.getAuthHeaders(),
                withCredentials: true
            });
            this.setState({ goals: response.data });
        } catch (error) {
            console.error("Error fetching goals: ", error);
            alert("Failed to fetch goals. Please try again later.");
        }
    };

    handleInputChange = (e) => {
        this.setState({ newGoal: e.target.value });
    };

    addGoal = async () => {
        const { newGoal } = this.state;
        if (newGoal.trim() !== "") {
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/goals`, {
                    name: newGoal,
                    progress: 0
                }, {
                    headers: this.getAuthHeaders()
                });
                this.setState({ goals: [...this.state.goals, response.data], newGoal: '' });
            } catch (error) {
                console.error('Error adding goal:', error);
            }
        }
    };

    updateGoalProgress = async () => {
        const { selectedGoalIndex, newProgress, goals } = this.state;
        if (selectedGoalIndex === null) return;

        const updatedGoal = {...goals[selectedGoalIndex]};
        updatedGoal.progress = Math.max(0, Math.min(100, parseInt(newProgress, 10)));

        try {
            await axios.put(`http://127.0.0.1:8000/api/goals/${updatedGoal.id}`, updatedGoal, {
                headers: this.getAuthHeaders()
            });

            const updatedGoals = [...goals];
            updatedGoals[selectedGoalIndex] = updatedGoal;

            this.setState({
                goals: updatedGoals,
                isModalOpen: false,
                selectedGoalIndex: null
            });
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    };

    deleteGoal = async (index) => {
        const goalId = this.state.goals[index].id;
        try {
            await axios.delete(`http://127.0.0.1:8000/api/goals/${goalId}`, {
                headers: this.getAuthHeaders()
            });
            const updatedGoals = this.state.goals.filter((goal, i) => i !== index);
            this.setState({ goals: updatedGoals });
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    openModal = (index) => {
        this.setState({
            isModalOpen: true,
            selectedGoalIndex: index,
            newProgress: this.state.goals[index].progress
        });
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            selectedGoalIndex: null
        });
    };

    handleProgressChange = (e) => {
        this.setState({ newProgress: e.target.value });
    };

    getProgressColor = (progress) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        if (progress < 100) return 'bg-blue-500';
        return 'bg-green-500';
    };

    getPerformanceSummary = () => {
        const { goals } = this.state;
        if (!goals.length) return { completedGoalsCount: 0, averageProgress: 0 };

        const completedGoals = goals.filter(goal => goal.progress >= 100);
        const averageProgress = goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length;

        return {
            completedGoalsCount: completedGoals.length,
            averageProgress: Math.round(averageProgress)
        };
    };

    render() {
        const { goals, newGoal, isModalOpen, selectedGoalIndex, newProgress } = this.state;
        const { completedGoalsCount, averageProgress } = this.getPerformanceSummary();

        return (
            <div className="max-w-4xl mx-auto p-10 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl shadow-xl border border-indigo-100">
                <h2 className="text-4xl font-bold text-center text-indigo-800 mb-8 tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Fitness Goals Tracker</span>
                </h2>

                <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                    <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Performance Summary</h3>
                    <div className="text-sm text-gray-600">
                        <p><strong>Goals Completed:</strong> {completedGoalsCount}</p>
                        <p><strong>Average Progress:</strong> {averageProgress}%</p>
                    </div>
                </div>

                <div className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={this.handleInputChange}
                        placeholder="Enter a fitness goal..."
                        className="flex-1 px-5 py-4 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    />
                    <button
                        onClick={this.addGoal}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md transform hover:scale-105 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Goal
                    </button>
                </div>

                <div className="space-y-5">
                    {goals.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-gray-500 text-lg">No goals yet. Add your first fitness goal above!</p>
                        </div>
                    ) : (
                        goals.map((goal, index) => (
                            <div
                                key={goal.id}
                                className={`p-6 rounded-xl shadow-md transition-all duration-300 ${
                                    goal.progress >= 100
                                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
                                        : 'bg-white hover:shadow-lg transform hover:-translate-y-1'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className={`font-semibold text-xl ${goal.progress >= 100 ? 'text-green-700' : 'text-gray-800'}`}>
                                        {goal.name}
                                        {goal.progress >= 100 && (
                                            <span className="ml-3 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full inline-flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                Completed!
                                            </span>
                                        )}
                                    </h4>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => this.openModal(index)}
                                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-300 text-sm shadow-sm flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                            </svg>
                                            Update
                                        </button>
                                        <button
                                            onClick={() => this.deleteGoal(index)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 text-sm shadow-sm flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Progress: {goal.progress}%</span>
                                        {goal.progress >= 100 && (
                                            <span className="text-green-600 font-semibold flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Goal achieved!
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-1000 ease-out ${this.getProgressColor(goal.progress)}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isModalOpen && selectedGoalIndex !== null && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-indigo-100 transform transition-all duration-300 scale-100">
                            <h3 className="text-2xl font-bold text-indigo-800 mb-6">Update Progress</h3>
                            <p className="mb-5 text-gray-700 font-medium">
                                Goal: <span className="text-indigo-600">{goals[selectedGoalIndex].name}</span>
                            </p>
                            <div className="mb-8">
                                <label className="block text-gray-700 mb-3 font-medium">Progress percentage:</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newProgress}
                                    onChange={this.handleProgressChange}
                                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between mt-2 text-sm">
                                    <span className="text-gray-500">0%</span>
                                    <span className="font-semibold text-indigo-700 text-lg">{newProgress}%</span>
                                    <span className="text-gray-500">100%</span>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={this.closeModal}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-300 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={this.updateGoalProgress}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300 font-medium shadow-md"
                                >
                                    Save Progress
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default GoalTracker;