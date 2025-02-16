import React, { useEffect, useState } from 'react';
import styles from './DietPlanForm.module.css';
import Spinner from './Spinner';
import DietPlan from './DietPlan';
import { fetchUserPreferences, getDietPlan, generateDietPlan } from '../services/api';

const DietForm = () => {
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');

    fetchUserPreferences(token)
      .then((data) => {
        if (!data) {
          setLoading(false);
          return;
        }
        setUserData(data);
        return getDietPlan(token);
      })
      .then((plan) => {
        if (plan) setDietPlan(parseDietPlan(plan.dietPlan));
      })
      .catch((error) => console.error("Error fetching diet plan:", error))
      .finally(() => setLoading(false));
  }, []);


  function parseDietPlann(dietPlanText) {
    if (!dietPlanText) {
      console.error("❌ No diet plan text provided.");
      return [];
    }
  
    const days = dietPlanText.split('---').filter(day => day.trim() !== ''); // Split by "---" and remove empty entries
    const structuredDietPlan = [];
  
    days.forEach((dayText) => {
      const lines = dayText.trim().split('\n').filter(line => line.trim() !== ''); // Split into lines & remove empty ones
  
      if (lines.length === 0) return;
  
      const dayTitle = lines[0].replace(/\*\*/g, '').trim(); // Extract "Day X" (remove markdown **)
      const meals = [];
  
      for (let i = 1; i < lines.length; i++) {
        // Matches "**Meal Type:** Description"
        const match = lines[i].match(/-\s\*\*(.+?)\*\*:\s(.+)/);
        if (match) {
          meals.push({
            meal: match[1].trim(), // Meal Type (e.g., Breakfast, Snack)
            description: match[2].trim() // Description (e.g., Turkey and avocado omelette)
          });
        }
      }
  
      structuredDietPlan.push({
        day: dayTitle,
        meals: meals.length > 0 ? meals : []
      });
    });
  
    return structuredDietPlan;
  }
  

  const handleGenerateDiet = async () => {
    setGenerating(true);
    const token = localStorage.getItem('token');

    if (!userData) {
      console.error("❌ No user preferences found!");
      setGenerating(false);
      return;
    }

    try {
      console.log("📤 Sending user preferences to API:", userData);
      const response = await generateDietPlan(userData, token);

      // const strigyfiedData = JSON.stringify(response.data.dietPlan);
      // console.log('strigyfiedData',strigyfiedData);
      // const structuredDietPlan = JSON.parse(strigyfiedData);
      const structuredDietPlan1 = JSON.parse(response.data.dietPlan);
      console.log('structureddietplan', structuredDietPlan1);
   
      
      if (response && response.data.dietPlan) {
        console.log("✅ Received generated diet plan:", response.data.dietPlan);
        setDietPlan(structuredDietPlan1);
      } else {
        console.error("❌ API response does not contain a valid diet plan.");
      }
    } catch (error) {
      console.error("❌ Error generating diet plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  const parseDietPlan = (dietPlanText) => {
    return dietPlanText
      .split('\n\n')
      .map((dayText) => {
        const [dayName, ...mealLines] = dayText.trim().split('\n');
        const meals = mealLines.map((line) => {
          const [mealType, description] = line.split(' - ').map((str) => str.trim());
          return { meal: mealType, description };
        });
        return { day: dayName, meals };
      });
  };

  return (
    <div className={styles.dietPlanFormPage}>
      {/* Generate Diet Button */}
      <button 
        className={styles.generateButton} 
        onClick={handleGenerateDiet} 
        disabled={generating}
      >
        {generating ? "Generating..." : "Generate Diet Plan"}
      </button>

      {loading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}

      {!loading && dietPlan ? (
        // <DietPlan dietPlan={dietPlan} />
        <div>
        {dietPlan.map((planItem) => (
          <div key={planItem.day} style={{ marginBottom: '2rem' }}>
            <h2>Day {planItem.day}</h2>
            <ul>
              {planItem.meals.map((meal, index) => (
                <li key={index} style={{ margin: '0.5rem 0' }}>
                  <strong>{meal.type}: </strong>
                  {meal.meal} — {meal.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      ) : (
        <p className={styles.noPlanMessage}>No diet plan available. Click "Generate Diet Plan" to create one.</p>
      )}
    </div>
  );
};

export default DietForm;
