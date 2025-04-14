import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useState } from 'react';
import MealDetails from './components/MealDetails';
import RandomRecipe from './components/RandomRecipe';
import './App.css';
import MealLists from './components/MealLists';
import RecipeSearchArea from './components/RecipeSearchArea';
import RecipeSearchCategory from './components/RecipeSearchCategory';
import SearchMealByName from './components/SearchMealByName';
// import { DarkModeProvider } from './context/DarkModeContext';

function App() {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [heartedMeals, setHeartedMeals] = useState<string[]>(() => {
    const savedHeartedMeals = localStorage.getItem('heartedMeals');
    return savedHeartedMeals ? JSON.parse(savedHeartedMeals) : [];
  });
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  let defaultFilter = '';
  if (localStorage.getItem('selectedFilter')) {
    defaultFilter = String(localStorage.getItem('selectedFilter'));
  } else {
    defaultFilter = 'Area';
  }
  const [filter] = useState(defaultFilter);

  return (
    <div>
      <Router basename="/recipe-react">
        <Routes>
          <Route path="/" element={<Navigate to="search/area" replace />} />
          <Route
            path="/search/meal"
            element={
              <SearchMealByName
                onSelectMeal={setSelectedMealId}
                setSelectedMeal={setSelectedMeal}
                filter={filter}
              />
            }
          />
          <Route
            path="/search/category"
            element={
              <>
                <MealDetails mealId={selectedMealId} />
                <RecipeSearchCategory
                  onSelectMeal={setSelectedMealId}
                  heartedMeals={heartedMeals}
                  setHeartedMeals={setHeartedMeals}
                  selectedMeal={selectedMeal}
                  setSelectedMeal={setSelectedMeal}
                />
              </>
            }
          />
          <Route
            path="/search/area"
            element={
              <>
                <MealDetails mealId={selectedMealId} />
                <RecipeSearchArea
                  onSelectMeal={setSelectedMealId}
                  heartedMeals={heartedMeals}
                  setHeartedMeals={setHeartedMeals}
                />
              </>
            }
          />
          <Route
            path="/random"
            element={
              <RandomRecipe
                heartedMeals={heartedMeals}
                setHeartedMeals={setHeartedMeals}
                setSelectedMeal={setSelectedMeal}
                onSelectMeal={setSelectedMealId}
                filter={filter}
              />
            }
          />
          <Route path="lists" element={<MealLists />} />
        </Routes>
      </Router>
      {/* <DarkModeProvider> */}

      {/* </DarkModeProvider> */}
    </div>
  );
}

export default App;
