import {Component} from 'react';

class GoalTracker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goals: JSON.parse(localStorage.getItem('goals')) || [],
            newGoal: '',
            isModalOpen: false,
            selectedGoalIndex: null,
            newProgress: ''
        };
    }

    handleInputChange = (e) => {
        this.setState({ newGoal: e.target.value });
    };

    addGoal = () => {
        const { newGoal, goals } = this.state;
        if (newGoal.trim() !== "") {
            const newGoals = [...goals, { text: newGoal, progress: 0 }];
            this.setState({ goals: newGoals, newGoal: '' }, () => {
                localStorage.setItem('goals', JSON.stringify(this.state.goals));
            });
        }
    };

    updateGoalProgress = () => {
        const updatedGoals = [...this.state.goals];
        const progress = parseInt(this.state.newProgress, 10);


        updatedGoals[this.state.selectedGoalIndex].progress = Math.max(0, Math.min(100, progress));
        this.setState({
            goals: updatedGoals,
            isModalOpen: false
        }, () => {
            localStorage.setItem('goals', JSON.stringify(this.state.goals));
        });
    };

    deleteGoal = (index) => {
        const updatedGoals = this.state.goals.filter((goal, i) => i !== index);
        this.setState({ goals: updatedGoals }, () => {
            localStorage.setItem('goals', JSON.stringify(this.state.goals));
        });
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


    getPerformanceSummary = () => {
        const totalGoals = this.state.goals.length;
        const goalsAchieved = this.state.goals.filter(goal => goal.progress >= 100).length;
        const averageProgress = totalGoals > 0
            ? this.state.goals.reduce((acc, goal) => acc + goal.progress, 0) / totalGoals
            : 0;

        return {
            totalGoals,
            goalsAchieved,
            averageProgress: averageProgress.toFixed(2)
        };
    };



    getProgressColor = (progress) => {
        if (progress < 30) return 'bg-red-500';
        if (progress < 70) return 'bg-yellow-500';
        if (progress < 100) return 'bg-blue-500';
        return 'bg-green-500';
    };

    render() {
        const { totalGoals, goalsAchieved, averageProgress } = this.getPerformanceSummary();

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


                <div className="bg-white p-6 rounded-xl shadow-md mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-indigo-100 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-indigo-800">Total Goals</p>
                            <p className="text-2xl font-bold text-indigo-900">{totalGoals}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-green-800">Goals Achieved</p>
                            <p className="text-2xl font-bold text-green-900">{goalsAchieved}</p>
                        </div>
                        <div className="bg-blue-100 p-4 rounded-lg text-center">
                            <p className="text-sm font-medium text-blue-800">Average Progress</p>
                            <p className="text-2xl font-bold text-blue-900">{averageProgress}%</p>
                        </div>
                    </div>
                </div>


                <div className="space-y-4">
                    {this.state.goals.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 bg-white rounded-xl">
                            <p>No goals yet. Add your first fitness goal above!</p>
                        </div>
                    ) : (
                        this.state.goals.map((goal, index) => {
                            const isCompleted = goal.progress >= 100;
                            const progressBarColor = this.getProgressColor(goal.progress);

                            return (
                                <div
                                    key={index}
                                    className={`p-5 rounded-xl shadow-md transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-green-50 border-l-4 border-green-500'
                                            : 'bg-white hover:shadow-lg'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className={`font-medium text-lg ${isCompleted ? 'text-green-700' : 'text-gray-800'}`}>
                                            {goal.text}
                                            {isCompleted && (
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
                                                className={`h-2.5 rounded-full ${progressBarColor}`}
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {this.state.isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Progress</h3>
                            {this.state.selectedGoalIndex !== null && (
                                <p className="mb-4 text-gray-600">
                                    Goal: {this.state.goals[this.state.selectedGoalIndex].text}
                                </p>
                            )}
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