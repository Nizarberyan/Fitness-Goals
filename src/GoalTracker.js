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
            newProgress: ''
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
            // Display a user-friendly message
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
        const updatedGoal = goals[selectedGoalIndex];
        updatedGoal.progress = Math.max(0, Math.min(100, parseInt(newProgress, 10)));

        try {
            await axios.put(`http://127.0.0.1:8000/api/goals/${updatedGoal.id}`, updatedGoal, {
                headers: this.getAuthHeaders()
            });
            this.setState({
                goals: [...goals],
                isModalOpen: false
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
        this.setState({ isModalOpen: false });
    };

    getProgressColor = (progress) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        if (progress < 100) return 'bg-blue-500';
        return 'bg-green-500';
    };

    render() {
        return (
            <div className="max-w-xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-indigo-800 mb-6">Fitness Goals Tracker</h2>

                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={this.state.newGoal}
                        onChange={this.handleInputChange}
                        placeholder="Enter a fitness goal..."
                        className="flex-1 px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <button
                        onClick={this.addGoal}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
                    >
                        Add Goal
                    </button>
                </div>

                <div className="space-y-4">
                    {this.state.goals.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-xl">
                            <p>No goals yet. Add your first fitness goal above!</p>
                        </div>
                    ) : (
                        this.state.goals.map((goal, index) => (
                            <div
                                key={goal.id}
                                className={`p-5 rounded-xl shadow-md ${goal.progress >= 100 ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white hover:shadow-lg'}`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className={`font-medium text-lg ${goal.progress >= 100 ? 'text-green-700' : 'text-gray-800'}`}>
                                        {goal.name}
                                        {goal.progress >= 100 && (
                                            <span className="ml-2 text-sm bg-green-500 text-white px-2 py-1 rounded-full">
                                                Completed!
                                            </span>
                                        )}
                                    </h4>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => this.openModal(index)}
                                            className="px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-200 text-sm shadow-sm"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => this.deleteGoal(index)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200 text-sm shadow-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Progress: {goal.progress}%</span>
                                        {goal.progress >= 100 && <span className="text-green-600 font-medium">Goal achieved!</span>}
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className={`h-2.5 rounded-full ${this.getProgressColor(goal.progress)}`}
                                            style={{ width: `${goal.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {this.state.isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Progress</h3>
                            <p className="mb-4 text-gray-600">
                                Goal: {this.state.goals[this.state.selectedGoalIndex].name}
                            </p>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">Progress percentage:</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={this.state.newProgress}
                                    onChange={(e) => this.setState({ newProgress: e.target.value })}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between">
                                    <span>0%</span>
                                    <span className="font-medium text-indigo-700">{this.state.newProgress}%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={this.closeModal}
                                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={this.updateGoalProgress}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
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
