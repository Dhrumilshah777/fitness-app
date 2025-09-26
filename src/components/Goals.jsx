import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const Goals = () => {
  const [goal, setGoal] = useState("");
  const [goals, setGoals] = useState([]);
  const [streak, setStreak] = useState(0);

  // ✅ Fetch goals
  useEffect(() => {
    const fetchGoals = async () => {
      const data = await getDocs(collection(db, "goals"));
      setGoals(data.docs.map((doc) => doc.data()));
    };
    fetchGoals();
  }, []);

  // ✅ Fetch workouts to calculate streak
  useEffect(() => {
    const fetchWorkouts = async () => {
      const data = await getDocs(collection(db, "workouts"));
      const workouts = data.docs.map((doc) => doc.data());

      // Extract unique workout dates (YYYY-MM-DD)
      const dates = workouts.map((w) => w.date);
      const uniqueDates = [...new Set(dates)].sort();

      // Calculate streak: check consecutive days
      let currentStreak = 0;
      let today = new Date().toISOString().split("T")[0];

      for (let i = uniqueDates.length - 1; i >= 0; i--) {
        const logDate = uniqueDates[i];
        if (logDate === today) {
          currentStreak++;
          today = new Date(
            new Date(today).setDate(new Date(today).getDate() - 1)
          )
            .toISOString()
            .split("T")[0];
        } else if (logDate === today) {
          // still consecutive
          currentStreak++;
        } else {
          break; // streak broken
        }
      }
      setStreak(currentStreak);
    };
    fetchWorkouts();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goal) return alert("Enter a goal!");

    try {
      await addDoc(collection(db, "goals"), {
        text: goal,
        createdAt: new Date().toISOString(),
      });
      setGoals([...goals, { text: goal }]);
      setGoal("");
      alert("Goal added!");
    } catch (err) {
      console.error(err);
      alert("Error adding goal.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">🎯 Fitness Goals & 🔥 Streaks</h2>

      {/* Goal Form */}
      <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Run 5km daily"
          className="border p-2 flex-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Goal
        </button>
      </form>

      {/* List of Goals */}
      <ul className="mb-6">
        {goals.length === 0 ? (
          <p>No goals set yet.</p>
        ) : (
          goals.map((g, idx) => (
            <li key={idx} className="p-2 border-b">
              ✅ {g.text}
            </li>
          ))
        )}
      </ul>

      {/* Streak Tracker */}
      <div className="text-center p-4 bg-yellow-100 rounded">
        <h3 className="text-xl font-semibold">🔥 Current Streak</h3>
        <p className="text-3xl font-bold text-red-600">{streak} days</p>
      </div>
    </div>
  );
};

export default Goals;
