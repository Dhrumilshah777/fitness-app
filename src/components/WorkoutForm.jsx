import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const WorkoutForm = () => {
  const [exercise, setExercise] = useState("");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");
  const [type, setType] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ Fetch workouts from Firestore, ordered by date descending
  const fetchWorkouts = async () => {
    try {
      const q = query(collection(db, "workouts"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  // ✅ Add workout to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!exercise || !duration || !calories || !type) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "workouts"), {
        exercise,
        duration: Number(duration),
        calories: Number(calories),
        type,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      });

      // Clear form fields
      setExercise("");
      setDuration("");
      setCalories("");
      setType("");

      // Refresh list automatically
      fetchWorkouts();

      alert("Workout added successfully!");
    } catch (error) {
      alert("Error adding workout: " + error.message);
    }
  };

  // ✅ Filter + search logic
  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch = w.exercise.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || w.type?.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Workout Tracker</h1>

      {/* Add Workout Form */}
      <div className="p-4 border rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Workout</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Exercise Name"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Calories Burned"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="yoga">Yoga</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Add Workout
          </button>
        </form>
      </div>

      {/* Search + Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by exercise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="all">All</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="yoga">Yoga</option>
        </select>
      </div>

      {/* Workout List */}
      <h2 className="text-xl font-semibold mb-4">Your Workouts</h2>
      <ul className="space-y-2">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map((w) => (
            <li
              key={w.id}
              className="border p-3 rounded shadow-sm flex justify-between items-center"
            >
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
          ))
        ) : (
          <p className="text-gray-500">No workouts found.</p>
        )}
      </ul>
    </div>
  );
};

export default WorkoutForm;
