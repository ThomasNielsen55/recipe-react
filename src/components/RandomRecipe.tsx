import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface RandomRecipeProps {
  heartedMeals: string[];
  setHeartedMeals: React.Dispatch<React.SetStateAction<string[]>>;
  onSelectMeal: (mealId: string) => void;
  filter: string;
  setSelectedMeal: React.Dispatch<React.SetStateAction<string | null>>;
}

const RandomRecipe = ({
  onSelectMeal,
  setSelectedMeal,
  heartedMeals,
  setHeartedMeals,
  filter,
}: RandomRecipeProps) => {
  const [randomRecipe, setRandomRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  filter = localStorage.getItem('selectedFilter')
    ? String(localStorage.getItem('selectedFilter'))
    : 'Area';

  const navigate = useNavigate();

  const fetchRandomRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch random recipe');
      }
      const data = await response.json();
      setRandomRecipe(data.meals[0]);
      setHasFetched(true);
    } catch (error) {
      console.error('Error fetching random recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !hasFetched) {
      fetchRandomRecipe();
    }
  }, [isMounted, hasFetched]);

  const handleHeartClick = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartedMeals((prevHeartedMeals) =>
      prevHeartedMeals.includes(mealId)
        ? prevHeartedMeals.filter((id) => id !== mealId)
        : [...prevHeartedMeals, mealId]
    );
  };

  const handleMealClick = (
    mealId: string,
    strCategory: string,
    strArea: string
  ) => {
    setSelectedMeal(mealId);
    localStorage.setItem('selectedMeal', mealId);
    localStorage.setItem('selectedCategory', strCategory);
    localStorage.setItem('selectedArea', strArea);
    onSelectMeal(mealId);
    filter === 'Area' ? navigate('/search/area') : navigate('/search/category');
  };

  return (
    <div className="random-recipe-container">
      <h1>Random Recipe</h1>
      <button
        onClick={() => navigate('/search/meal')}
        className="floating-search-button"
      >
        🔍
        <span className="tooltip-text">Search for a meal</span>
      </button>
      <button
        onClick={() => navigate('/search/area')}
        className="floating-filter-button"
      >
        🗺️
        <span className="tooltip-text">Filter by area</span>
      </button>
      <button
        onClick={() => navigate('/search/category')}
        className="floating-filter-button-stack"
      >
        🍗
        <span className="tooltip-text">Filter by category</span>
      </button>
      <button
        onClick={fetchRandomRecipe}
        className="floating-random-recipe-button"
      >
        🎲
        <span className="tooltip-text">Choose a random recipe</span>
      </button>

      {loading && <p>Loading...</p>}
      {randomRecipe && !loading && (
        <div
          key={randomRecipe.idMeal}
          className={`search-card`}
          onClick={() =>
            handleMealClick(
              randomRecipe.idMeal,
              randomRecipe.strCategory,
              randomRecipe.strArea
            )
          }
        >
          <h2>{randomRecipe.strMeal}</h2>
          <img
            src={randomRecipe.strMealThumb}
            alt={randomRecipe.strMeal}
            style={{ width: '250px', height: 'auto' }}
          />
          <h3>^^click to learn more^^</h3>
        </div>
      )}

      {/* Heart icon in the top-left corner */}
      {randomRecipe && (
        <div
          className="heart-icon"
          onClick={(e) => handleHeartClick(randomRecipe.idMeal, e)}
          style={{
            position: 'fixed', // Fixed positioning to stay at the top-left of the screen
            top: '10px', // 10px from the top
            left: '15px', // 10px from the left
            fontSize: '32px',
            cursor: 'pointer',
            width: 30,
            zIndex: 10, // Ensure it appears above other content
          }}
        >
          {heartedMeals.includes(randomRecipe?.idMeal) ? '❤️' : '🤍'}
        </div>
      )}
    </div>
  );
};

export default RandomRecipe;
