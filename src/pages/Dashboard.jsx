import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, get } from "firebase/database";
import { FaUserCircle, FaSignInAlt, FaDumbbell, FaChartLine, FaRunning, FaBiking, FaWalking } from "react-icons/fa";

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const snapshot = await get(ref(db, "workouts"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arr = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setWorkouts(arr);
        } else {
          setWorkouts([]);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="min-h-screen flex bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-15 bg-gradient-to-b from-purple-700 to-indigo-700 text-white flex flex-col items-center py-6 space-y-6">
        <FaWalking size={24} className="hover:text-white text-white/70" />
        <FaRunning size={24} className="hover:text-white text-white/70" />
        <FaBiking size={24} className="hover:text-white text-white/70" />
        <FaDumbbell size={24} className="hover:text-white text-white/70" />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Navbar */}
        <div className=" text-black px-8 py-3 flex justify-between items-center ">
          <h2 className="text-2xl font-semibold">Progress Dashboard</h2>
        </div>

        {/* Main Body */}
        <div className="p-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/workout" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
              <FaDumbbell /> Workout Logger
            </Link>
            <Link to="/diet" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center gap-2">
              🍽️ Diet Tracker
            </Link>
           
            <Link to="/chart" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
              <FaChartLine /> Chart
            </Link>
            <Link to="/goals" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 flex items-center gap-2">
              🎯 Goals
            </Link>
          </div>

          {/* Workout Logs */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Workout History</h3>
            {sortedWorkouts.length === 0 ? (
              <p>No workout data yet.</p>
            ) : (
              <ul className="space-y-4">
                {sortedWorkouts.map((w) => (
                  <li key={w.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{w.exercise}</p>
                      <p className="text-sm text-gray-600">
                        {w.duration} mins | {w.calories} cal | {w.date}
                      </p>
                    </div>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                      {w.type || "Other"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

