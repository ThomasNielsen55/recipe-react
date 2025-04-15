# Recipe-Explorer

This is a single-page React application that allows users to explore and search for meals using TheMealDB API. Built with React, TypeScript, and Vite.

## Project Description

Users can:

- Search meals by name, area, or category
- View detailed information about each meal
- Get a random recipe
- Heart (favorite) meals and view them later

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
