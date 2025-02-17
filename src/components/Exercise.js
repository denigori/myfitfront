import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Exercise.module.css'; // Ensure correct path
import Spinner from './Spinner';
import { fetchUserPreferences, getExercise, generateExercise } from '../services/api';

function ExercisePage() {
  const [userData, setUserData] = useState(null);
  const [exercisePlan, setExercisePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return; // or redirect if token is missing

    setLoading(true);

    fetchUserPreferences(token)
      .then((data) => {
        if (!data) return;
        setUserData(data);
        return getExercise(token);
      })
      .then((plan) => {
        // `plan` is the response from getExercise()
        // If the plan contains a JSON string or a raw text
        if (plan && plan.exercisePlan) {
          try {
            // Try parsing as JSON
            const parsed = JSON.parse(plan.exercisePlan);
            setExercisePlan(parsed);
          } catch (err) {
            // Otherwise parse as fallback text
            setExercisePlan(parseExerciseFallback(plan.exercisePlan));
          }
        }
      })
      .catch((error) => {
        console.error('Error fetching exercise plan:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * parseExerciseFallback (Text-based fallback)
   * -------------------------------------------------
   * If the exercise plan is returned as plain text instead of JSON,
   * split it into "day" blocks by blank lines, then parse each line.
   * Adjust this logic if your text format differs.
   */
  const parseExerciseFallback = (exercisePlanText = '') => {
    if (!exercisePlanText.trim()) return [];

    return exercisePlanText
      .split('\n\n') // Split into day blocks by blank lines
      .map((dayBlock) => {
        const lines = dayBlock.trim().split('\n').map((l) => l.trim());
        if (!lines.length) return null;

        // First line might say "Day X"
        const rawDayName = lines[0];
        const dayNumber = rawDayName.replace(/^Day\s*/i, ''); // e.g. "Day 1" => "1"
        const exerciseLines = lines.slice(1);

        const exercises = exerciseLines.map((line) => {
          // Example line: "ExerciseName - sets x reps - description"
          const [name, setsReps, description] = line.split(' - ').map((str) => str.trim());
          return {
            name: name || 'Unnamed Exercise',
            sets: setsReps || 'N/A',
            reps: '',
            description: description || '',
          };
        });

        return { day: Number(dayNumber), exercises };
      })
      .filter(Boolean);
  };

  /**
   * handleGenerateExercise
   * -------------------------------------------------
   * Generates a new exercise plan based on user preferences.
   */
  const handleGenerateExercise = async () => {
    setGenerating(true);
    const token = localStorage.getItem('token');

    if (!userData) {
      console.error('No user preferences found!');
      setGenerating(false);
      return;
    }

    try {
      const response = await generateExercise(userData, token);
      if (response && response.data.exercisePlan) {
        // Attempt to parse the exercise plan as JSON
        const parsedExercisePlan = JSON.parse(response.data.exercisePlan);
        setExercisePlan(parsedExercisePlan);
      } else {
        console.error("API response doesn't contain a valid exercise plan.");
      }
    } catch (error) {
      console.error('Error generating exercise plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.exercisePlanPage}>
      {/* Generate Exercise Button */}
      <button
        className={styles.generateButton}
        onClick={handleGenerateExercise}
        disabled={generating}
      >
        {generating ? 'Generating...' : 'Generate Exercise Plan'}
      </button>

      {/* Show a loading spinner if fetching */}
      {loading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}

      {/* Horizontal Scrollable Cards */}
      {!loading && exercisePlan ? (
        <div className={styles.cardsContainer}>
          {exercisePlan.map((dayItem, dayIndex) => (
            <div className={styles.dayCard} key={dayIndex}>
              <h2 className={styles.dayTitle}>Day {dayItem.day}</h2>
              <ul className={styles.exercisesList}>
                {dayItem.exercises.map((exercise, exIndex) => (
                  <li className={styles.exerciseItem} key={exIndex}>
                    <strong>{exercise.name}</strong>
                    <p className={styles.exerciseSetsReps}>
                      {exercise.sets} {exercise.reps && `x ${exercise.reps}`}
                    </p>
                    {exercise.description && (
                      <p className={styles.exerciseDescription}>
                        {exercise.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className={styles.noPlanMessage}>
            No exercise plan available. Click "Generate Exercise Plan" to create one.
          </p>
        )
      )}
    </div>
  );
}

export default ExercisePage;
