import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const DietTracker = () => {
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");
  const [meals, setMeals] = useState([]);

  // Fetch meals from Firestore
  useEffect(() => {
    const fetchMeals = async () => {
      const data = await getDocs(collection(db, "meals"));
      setMeals(data.docs.map(doc => doc.data()));
    };
    fetchMeals();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!meal || !calories) {
      alert("Please enter meal and calories!");
      return;
    }

    try {
      await addDoc(collection(db, "meals"), {
        meal,
        calories: Number(calories),
        date: new Date().toISOString().split("T")[0],
      });

      setMeal("");
      setCalories("");

      alert("Meal logged successfully!");
    } catch (error) {
      alert("Error adding meal: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-4">
      <h2 className="text-2xl font-bold mb-4">Diet Tracker</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input
          type="text"
          placeholder="Meal Name"
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
        >
          Add Meal
        </button>
      </form>

      {/* Meals List */}
      <h3 className="text-lg font-semibold mb-2">Logged Meals</h3>
      {meals.length === 0 ? (
        <p>No meals logged yet.</p>
      ) : (
        <ul className="list-disc list-inside">
          {meals.map((m, index) => (
            <li key={index}>
              {m.date} - {m.meal} 🍽️ ({m.calories} cal)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DietTracker;
