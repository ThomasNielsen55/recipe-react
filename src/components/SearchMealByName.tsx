import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

interface SearchByNameProps {
  onSelectMeal: (mealId: string) => void;
  filter: string;
  setSelectedMeal: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchMealByName = ({
  onSelectMeal,
  setSelectedMeal,
  filter,
}: SearchByNameProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function
  filter = localStorage.getItem('selectedFilter')
    ? String(localStorage.getItem('selectedFilter'))
    : 'Area';

  // Automatically search when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setMeals([]); // Clear meals if searchQuery is empty
      return;
    }

    const fetchMeals = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
        );
        const data = await response.json();

        if (data.meals) {
          setMeals(data.meals);
        } else {
          setMeals([]);
        }
      } catch (error) {
        setError('Failed to fetch meals');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [searchQuery]); // Trigger this effect when searchQuery changes

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
    <div className="search-meal-by-name-container">
      {/* Button to navigate back to /search/area */}

      <div className="search-header">
        <h2>Search Meal by Name</h2>
        <input
          type="text"
          placeholder="Enter meal name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* <h3>Search Results:</h3> */}
      </div>
      <div className="search_grid">
        <button
          // onClick={() => navigate('/search/meal')}
          className="floating-search-button-selected-search"
        >
          🔍
          {/* <span className="tooltip-text">Search for a meal</span> */}
        </button>
        <button
          onClick={() => navigate('/search/area')}
          className="floating-filter-button-search"
        >
          🗺️
          <span className="tooltip-text">Filter by area</span>
        </button>
        <button
          onClick={() => navigate('/search/category')}
          className="floating-filter-button-stack-search"
        >
          🍗
          <span className="tooltip-text">Filter by category</span>
        </button>
        <button
          onClick={() => navigate('/random')}
          className="floating-random-recipe-button-search"
        >
          🎲
          <span className="tooltip-text">Choose a random recipe</span>
        </button>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {meals && meals.length > 0 && (
          <div>
            <ul>
              {meals.map((meal) => (
                <li
                  key={meal.idMeal}
                  className={`search-card`}
                  onClick={() =>
                    handleMealClick(meal.idMeal, meal.strCategory, meal.strArea)
                  }
                >
                  <h3>{meal.strMeal}</h3>
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                </li>
              ))}
            </ul>
          </div>
        )}
        {meals && meals.length === 0 && !loading && (
          <p>Start typing to find a meal</p>
        )}
      </div>
    </div>
  );
};

export default SearchMealByName;
