import { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, get } from "firebase/database";  // ✅ use Realtime Database
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = () => {
  const [workouts, setWorkouts] = useState([]);
  const [view, setView] = useState("weekly");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const snapshot = await get(ref(db, "workouts")); // ✅ fetch from Realtime DB
        if (snapshot.exists()) {
          const data = Object.values(snapshot.val()); // convert object to array
          setWorkouts(data);
        } else {
          setWorkouts([]);
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, []);

  // ✅ Grouping logic stays the same
  const groupData = (type) => {
    const grouped = {};
    workouts.forEach((w) => {
      const date = new Date(w.date);
      let key = "";

      if (type === "weekly") {
        const firstDay = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + firstDay.getDay() + 1) / 7);
        key = `Week ${weekNumber} (${date.getFullYear()})`;
      } else if (type === "monthly") {
        key = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
      }

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += w.calories || 0;
    });

    return grouped;
  };

  const groupedWorkouts = groupData(view);

  const chartData = {
    labels: Object.keys(groupedWorkouts),
    datasets: [
      {
        label: `Calories Burned (${view})`,
        data: Object.values(groupedWorkouts),
        borderColor: view === "weekly" ? "#3B82F6" : "#10B981",
        backgroundColor: view === "weekly" ? "#93C5FD" : "#6EE7B7",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Calories Burned - ${view === "weekly" ? "Weekly" : "Monthly"} View`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Progress Chart</h2>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setView("weekly")}
          className={`px-4 py-2 rounded ${
            view === "weekly" ? "bg-blue-500 text-white" : "bg-gray-300"
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setView("monthly")}
          className={`px-4 py-2 rounded ${
            view === "monthly" ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          Monthly
        </button>
      </div>

      {/* Chart Display */}
      {workouts.length === 0 ? (
        <p>No workout data yet.</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md" style={{ height: "400px" }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
