# Recipe-Explorer

This is a single-page React application that allows users to explore and search for meals using TheMealDB API. Built with React, TypeScript, and Vite.

## Project Description

Users can:

- Search meals by name, area, or category
- View detailed information about each meal
- Get a random recipe
- Heart (like) meals and view them later

## How to run the Project

view the deployed website (using GitHub Pages) here:
https://thomasnielsen55.github.io/recipe-react/

to run the app on your own machine:

- clone the project:
  - git clone https://github.com/ThomasNielsen55/recipe-react.git
- get in the right directory (you probably start in the right place):
  - cd frontend
- Install dependencies:
  - npm install
- start the dev server:
  - npm run dev

## API used...data handling and structure

Public API for recipes and meals:
https://www.themealdb.com/api.php

API urls:

- to lookup full meal details by id
  - `https://www.themealdb.com/api/json/v1/1/lookup.php?i={recipeID}`
- to lookup a random meal
  - `https://www.themealdb.com/api/json/v1/1/random.php`
- to list all meal categories
  - `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
- to list all meal areas
  - `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
- to filter by category
  - `https://www.themealdb.com/api/json/v1/1/filter.php?c={category}`
- to filter by area
  - `https://www.themealdb.com/api/json/v1/1/filter.php?a={area}`
- to search by name
  - `https://www.themealdb.com/api/json/v1/1/search.php?s={searchQuery}`

## additional features

localstorage:
the hearted meals are stored in local storage
the last recipe clicked is stored in local storage, so when the page reopens it goes to the meal details for that meal
when the random meal card or one of the search by name cards are clicked the category and area are stored so the user starts with the right filter when switching back to the area or category filters

auto-scroll:
when the selected meal is in the filtered meals (by area or category) it scrolls to that card on render.

mobile:
it has styles that work for a smaller screen (phone sized)

routing:
there are 3 pages. the main page has the MealDetails.tsx and either RecipeSearchArea.tsx or RecipeSearchCategory.tsx depending on the routing (there is a route to switch from area to category and vice versa). AreaDropDown.tsx and CategoryDropDown.tsx are on this page. Then there is a search page that holds SearchMealByName.tsx. Last there is a page with RandomRecipe.tsx.

organization:

/src/:

- assets:
  -- an image

- components:
  -- AreaDropDown.tsx -> The drop down to select an area to filter by
  -- CategoryDropDown.tsx -> The drop down to select a category to filter by
  -- MealDetails.tsx -> shows all of the meal details and recipe instructions
  -- RandomRecipe.tsx -> shows one random meal. the user can like it. the user can click it and go back to the main page with this meal selected
  -- RecipeSearchArea.tsx -> all the recipes in the selected area are shown. user can click one and its details will appear in the MealDetails.tsx. the user can like recipe's here. if 'all' is selected all the recipes are shown
  -- RecipeSearchCategory.tsx -> all the recipes in the selected category are shown. user can click one and its details will appear in the MealDetails.tsx. the user can like recipe's here. if 'all' is selected all the recipes are shown
  -- SearchMealByName.tsx -> a search bar. as the user types meals are displayed. the user can click one of these meals and go back to the main page with this meal selected
  -- MealLists.tsx -> This is a component i built to see all the areas, categories, and ingredients. Not seen by the user.

- context: (i deleted this folder)
- i had a dark mode, but i deleted it so nevermind.

- types:
- Meal.ts contains the interface definitions for Meal, MealDetail, and MealSummary which are used throughout the application

- App.css -> all of my styles for the whole project are in this file. I have it mostly in a logical order with some exceptions.
- App.tsx -> my routing is taken care of here. some of my state items are located here (the ones used in multiple child components).
