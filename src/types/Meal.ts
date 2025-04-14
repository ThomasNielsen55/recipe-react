export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  strSource?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  // Add up to strIngredient20
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  // Add up to strMeasure20
  [key: string]: string | undefined; // This ensures we can handle ingredients dynamically
}
