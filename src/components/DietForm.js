import React, { useEffect, useState } from 'react';
import styles from './DietPlanForm.module.css';
import Spinner from './Spinner';
import { fetchUserPreferences, getDietPlan, generateDietPlan } from '../services/api';

const DietForm = () => {
  const [userData, setUserData] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // No token => do nothing or redirect

    setLoading(true);

    fetchUserPreferences(token)
      .then((data) => {
        if (!data) return;
        setUserData(data);
        return getDietPlan(token);
      })
      .then((plan) => {
        if (plan && plan.dietPlan) {
          try {
            // If dietPlan is JSON
            const parsed = JSON.parse(plan.dietPlan);
            setDietPlan(parsed);
          } catch (err) {
            // Otherwise parse as text fallback
            setDietPlan(parseDietPlan(plan.dietPlan));
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching diet plan:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * parseDietPlan (Text-Fallback)
   * -----------
   * Splits text by blank lines => Day blocks
   * Then each day block is lines => first line is day, rest are meals
   * Format example:
   *   Day 1
   *   Breakfast - Oatmeal
   *   Lunch - Chicken Salad
   */
  const parseDietPlan = (dietPlanText = '') => {
    if (!dietPlanText.trim()) return [];

    return dietPlanText
      .split('\n\n') // Split into day blocks by blank lines
      .map((dayBlock) => {
        const lines = dayBlock.trim().split('\n').map((l) => l.trim());
        if (!lines.length) return null;

        const rawDayName = lines[0];
        const dayNumber = rawDayName.replace(/^Day\s*/i, ''); // e.g. "Day 1" => "1"
        const mealLines = lines.slice(1);

        const meals = mealLines.map((line) => {
          const [type, meal, description] = line.split(' - ').map((str) => str.trim());
          return {
            type: type || 'Meal',
            meal: meal || 'Unnamed Meal',
            description: description || '',
          };
        });

        return { day: dayNumber, meals };
      })
      .filter(Boolean);
  };

  /**
   * handleGenerateDiet
   * -----------
   * Generates a new diet plan using userData via the API.
   */
  const handleGenerateDiet = async () => {
    setGenerating(true);
    const token = localStorage.getItem('token');

    if (!userData) {
      console.error('No user preferences found!');
      setGenerating(false);
      return;
    }

    try {
      const response = await generateDietPlan(userData, token);
      if (response && response.data.dietPlan) {
        const parsedDietPlan = JSON.parse(response.data.dietPlan);
        setDietPlan(parsedDietPlan);
      } else {
        console.error("API response doesn't contain a valid diet plan.");
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.dietPlanFormPage}>
      {/* Generate Diet Button */}
      <button
        className={styles.generateButton}
        onClick={handleGenerateDiet}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Diet Plan'}
      </button>

      {/* Show a loading spinner if fetching */}
      {loading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}

      {/* Scrollable Cards */}
      {!loading && dietPlan ? (
        <div className={styles.cardsContainer}>
          {dietPlan.map((planItem, dayIndex) => (
            <div className={styles.dayCard} key={dayIndex}>
              <h2 className={styles.dayTitle}>Day {planItem.day}</h2>
              <ul className={styles.mealsList}>
                {planItem.meals.map((meal, mealIndex) => (
                  <li className={styles.mealItem} key={mealIndex}>
                    <strong>{meal.type}</strong>:
                    {' '}
                    {meal.meal}
                    {meal.description ? ` — ${meal.description}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className={styles.noPlanMessage}>
            No diet plan available. Click "Generate Diet Plan" to create one.
          </p>
        )
      )}
    </div>
  );
};

export default DietForm;
