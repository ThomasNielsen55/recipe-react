import { useState, useEffect } from 'react';
// import { useDarkMode } from '../context/DarkModeContext';
import { MealSummary } from '../types/Meal';
import { useNavigate } from 'react-router-dom';
import AreaDropDown from './AreaDropDown';

interface RecipeSearchProps {
  onSelectMeal: (mealId: string) => void;
  heartedMeals: string[];
  setHeartedMeals: React.Dispatch<React.SetStateAction<string[]>>;
}

const RecipeSearchArea = ({
  onSelectMeal,
  heartedMeals,
  setHeartedMeals,
}: RecipeSearchProps) => {
  // const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use global dark mode state
  let defaultArea = '';
  if (localStorage.getItem('selectedArea')) {
    defaultArea = String(localStorage.getItem('selectedArea'));
  } else {
    defaultArea = 'Japanese';
  }

  const [area, setArea] = useState(defaultArea);
  const navigate = useNavigate();
  // const [area, setArea] = useState('Japanese');
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const [showHeartedOnly, setShowHeartedOnly] = useState(false);

  // Error and loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    // Function to fetch meals
    const fetchMeals = async (area: string) => {
      setLoading(true);
      setError(null);
      try {
        if (area === 'All') {
          // Fetch all categories (Seafood, Beef, Chicken, Vegetarian)
          const areas = [
            'American',
            'British',
            'Canadian',
            'Chinese',
            'Croatian',
            'Dutch',
            'Egyptian',
            'Filipino',
            'French',
            'Greek',
            'Indian',
            'Irish',
            'Italian',
            'Jamaican',
            'Japanese',
            'Kenyan',
            'Malaysian',
            'Mexican',
            'Moroccan',
            'Polish',
            'Portuguese',
            'Russian',
            'Spanish',
            'Thai',
            'Tunisian',
            'Turkish',
            'Ukrainian',
            'Uruguayan',
            'Vietnamese',
          ];
          const fetchPromises = areas.map(async (are) => {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?a=${are}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch meals for category: ${are}`);
            }
            return response.json();
          });

          // Wait for all fetches to complete and merge the results
          const allAreaMeals = await Promise.all(fetchPromises);

          // Combine all meals from different categories into one array
          const allMeals = allAreaMeals.flatMap((data) => data.meals);
          setMeals(allMeals || []);
          if (window.innerWidth > 768) {
            let scrollyMealId = '';
            if (localStorage.getItem('selectedMeal')) {
              scrollyMealId = String(localStorage.getItem('selectedMeal'));
              setSelectedMeal(scrollyMealId);
            }
            console.log('Effect running', {
              scrollyMealId,
              mealsLength: allMeals.length,
            });
            if (scrollyMealId && allMeals.length > 0) {
              setTimeout(() => {
                const el = document.getElementById(
                  `meal-card-${scrollyMealId}`
                );
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100); // 100ms delay gives time for render
            }
          }
        } else {
          // Fetch only the selected category
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch meals');
          }
          const data = await response.json();
          setMeals(data.meals || []);
          if (window.innerWidth > 768) {
            let scrollyMealId = '';
            if (localStorage.getItem('selectedMeal')) {
              scrollyMealId = String(localStorage.getItem('selectedMeal'));
              setSelectedMeal(scrollyMealId);
            }
            console.log('Effect running', {
              scrollyMealId,
              mealsLength: data.meals.length,
            });
            if (scrollyMealId && data.meals.length > 0) {
              setTimeout(() => {
                const el = document.getElementById(
                  `meal-card-${scrollyMealId}`
                );
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100); // 100ms delay gives time for render
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Something went wrong. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Call fetchMeals with the current category
    localStorage.setItem('selectedFilter', 'Area');
    localStorage.setItem('selectedArea', area);
    fetchMeals(area);
  }, [area, retry]);

  useEffect(() => {
    localStorage.setItem('heartedMeals', JSON.stringify(heartedMeals));
  }, [heartedMeals]);

  const handleCardClick = (mealId: string) => {
    setSelectedMeal(mealId);
    localStorage.setItem('selectedMeal', mealId);
    onSelectMeal(mealId);
  };

  const handleHeartClick = (mealId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartedMeals((prevHeartedMeals) =>
      prevHeartedMeals.includes(mealId)
        ? prevHeartedMeals.filter((id) => id !== mealId)
        : [...prevHeartedMeals, mealId]
    );
  };

  const filteredMeals = showHeartedOnly
    ? meals.filter((meal) => heartedMeals.includes(meal.idMeal))
    : meals;

  const handleRetry = () => {
    setRetry((prev) => !prev); // Toggle retry state
  };

  return (
    <div className="recipe-container">
      <div className="finder-banner">
        {loading ? (
          <h1 className="loading-text">Loading...</h1>
        ) : (
          <h1>Find a recipe</h1>
        )}
        <button
          onClick={() => navigate('/search/meal')}
          className="floating-search-button"
        >
          🔍
          <span className="tooltip-text">Search for a meal</span>
        </button>
        <button
          onClick={() => navigate('/search/category')}
          className="floating-filter-button"
        >
          🍗
          <span className="tooltip-text">Filter by category</span>
        </button>
        <button
          onClick={() => navigate('/random')}
          className="floating-random-recipe-button"
        >
          🎲
          <span className="tooltip-text">Choose a random recipe</span>
        </button>

        <div className="finder-controls">
          {/* Dark Mode Button (Optional) */}
          {/* <button onClick={toggleDarkMode} className="mode-toggle">
      {isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button> */}

          <div className="control-item">
            <input
              type="checkbox"
              id="heartedOnly"
              checked={showHeartedOnly}
              onChange={() => setShowHeartedOnly((prev) => !prev)}
            />
            <label htmlFor="heartedOnly">Display liked</label>
          </div>

          <div className="control-item">
            <AreaDropDown area={area} setArea={setArea} />
          </div>
        </div>
      </div>
      {error && (
        <div>
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

      {!error && (
        <div className="meal-grid">
          {filteredMeals.map((meal) => (
            <div
              key={meal.idMeal}
              id={`meal-card-${meal.idMeal}`}
              className={`meal-card ${selectedMeal === meal.idMeal ? 'selected' : ''}`}
              onClick={() => handleCardClick(meal.idMeal)}
            >
              <h3>{meal.strMeal}</h3>
              <img src={meal.strMealThumb} alt={meal.strMeal} width="200" />
              <div
                className="heart-icon"
                onClick={(e) => handleHeartClick(meal.idMeal, e)}
              >
                {heartedMeals.includes(meal.idMeal) ? '❤️' : '🤍'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSearchArea;
