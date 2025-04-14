import { useState, useEffect } from 'react';
import { MealDetail } from '../types/Meal';

interface MealDetailsProps {
  mealId: string | null;
}

const MealDetails = ({ mealId: propMealId }: MealDetailsProps) => {
  let defaultMealId;
  if (localStorage.getItem('selectedMeal')) {
    defaultMealId = localStorage.getItem('selectedMeal');
  } else {
    defaultMealId = '52772'; // You can change this to any default mealId
  }
  const [mealId, setMealId] = useState<string | null>(
    propMealId || defaultMealId
  );
  const [meal, setMeal] = useState<MealDetail | null>(null);

  useEffect(() => {
    if (propMealId && propMealId !== mealId) {
      setMealId(propMealId);
    }
  }, [propMealId, mealId]);

  useEffect(() => {
    if (!mealId) return; // Don't fetch if no meal is selected

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          setMeal(data.meals[0] as MealDetail);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, [mealId]);

  if (!mealId) return <p>Select a meal to see details</p>;
  if (!meal) return <p>Loading meal details...</p>;

  // Collect ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`${ingredient}: ${measure}`);
    }
  }

  return (
    <div className="meal-details-container">
      <div className="meal-header">
        <h2>{meal.strMeal}</h2>
        <p>
          <strong>Category:</strong>&nbsp; {meal.strCategory}{' '}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Area:</strong> &nbsp;
          {meal.strArea}
        </p>

        <img src={meal.strMealThumb} alt={meal.strMeal} width="300" />
      </div>
      <div className="instructions-container">
        <p>{meal.strInstructions}</p>
      </div>

      {ingredients.length > 0 && (
        <div className="ingredients-container">
          <h3>Ingredients:</h3>

          <ul className="ingredients-list">
            {ingredients.map((ingredient, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="bottom-links-container">
        {meal.strYoutube && (
          <p>
            <strong>Watch on YouTube:</strong>{' '}
            <a href={meal.strYoutube} target="_blank" rel="noopener noreferrer">
              Click here
            </a>
          </p>
        )}

        {meal.strSource && (
          <p>
            <strong>Recipe Source:</strong>{' '}
            <a href={meal.strSource} target="_blank" rel="noopener noreferrer">
              View Recipe
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default MealDetails;
