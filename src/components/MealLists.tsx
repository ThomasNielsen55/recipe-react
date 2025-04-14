import { useState, useEffect } from 'react';

const MealLists = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories, areas, and ingredients
  const fetchMealLists = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching

    try {
      // Fetch categories
      const categoryResponse = await fetch(
        'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
      );
      const categoryData = await categoryResponse.json();
      setCategories(categoryData.meals.map((meal: any) => meal.strCategory));

      // Fetch areas
      const areaResponse = await fetch(
        'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
      );
      const areaData = await areaResponse.json();
      setAreas(areaData.meals.map((meal: any) => meal.strArea));

      // Fetch ingredients
      const ingredientResponse = await fetch(
        'https://www.themealdb.com/api/json/v1/1/list.php?i=list'
      );
      const ingredientData = await ingredientResponse.json();
      setIngredients(
        ingredientData.meals.map((meal: any) => meal.strIngredient)
      );
    } catch (error) {
      setError('Failed to fetch meal lists');
      console.error('Error fetching meal lists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealLists();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="meal-lists-container">
      <h1>Meal Lists</h1>

      <div className="list-section">
        <h2>Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h2>Areas</h2>
        <ul>
          {areas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h2>Ingredients</h2>
        <ul>
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealLists;
