import { useState, useEffect } from 'react';
// import { useDarkMode } from '../context/DarkModeContext';
import { MealSummary } from '../types/Meal';
import { useNavigate } from 'react-router-dom';
import CategoryDropDown from './CategoryDropDown';

interface RecipeSearchProps {
  onSelectMeal: (mealId: string) => void;
  heartedMeals: string[];
  setHeartedMeals: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMeal: string | null;
  setSelectedMeal: React.Dispatch<React.SetStateAction<string | null>>;
}

const RecipeSearchCategory = ({
  onSelectMeal,
  heartedMeals,
  setHeartedMeals,
  selectedMeal,
  setSelectedMeal,
}: RecipeSearchProps) => {
  // const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use global dark mode state
  let defaultCategory = '';
  if (localStorage.getItem('selectedCategory')) {
    defaultCategory = String(localStorage.getItem('selectedCategory'));
  } else {
    defaultCategory = 'Dessert';
  }
  const [category, setCategory] = useState(defaultCategory);

  const navigate = useNavigate();
  // const [category, setCategory] = useState('Dessert');
  const [meals, setMeals] = useState<MealSummary[]>([]);

  const [showHeartedOnly, setShowHeartedOnly] = useState(false);

  // Error and loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(false);

  useEffect(() => {
    // Function to fetch meals
    const fetchMeals = async (category: string) => {
      setLoading(true);
      setError(null);
      try {
        if (category === 'All') {
          // Fetch all categories (Seafood, Beef, Chicken, Vegetarian)
          const categories = [
            'Beef',
            'Breakfast',
            'Chicken',
            'Dessert',
            'Goat',
            'Lamb',
            'Miscellaneous',
            'Pasta',
            'Pork',
            'Seafood',
            'Side',
            'Starter',
            'Vegan',
            'Vegetarian',
          ];
          const fetchPromises = categories.map(async (cat) => {
            const response = await fetch(
              `https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch meals for category: ${cat}`);
            }
            return response.json();
          });

          // Wait for all fetches to complete and merge the results
          const allCategoryMeals = await Promise.all(fetchPromises);

          // Combine all meals from different categories into one array
          const allMeals = allCategoryMeals.flatMap((data) => data.meals);
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
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
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
    localStorage.setItem('selectedFilter', 'Category');
    localStorage.setItem('selectedCategory', category);
    fetchMeals(category);
  }, [category, retry]);

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
          onClick={() => navigate('/search/area')}
          className="floating-filter-button"
        >
          🗺️
          <span className="tooltip-text">Filter by area</span>
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
            <CategoryDropDown category={category} setCategory={setCategory} />
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

export default RecipeSearchCategory;
