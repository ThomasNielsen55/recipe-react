import { useState, useEffect } from 'react';

interface CategoryDropDownProps {
  category: string;
  setCategory: (category: string) => void;
}

const CategoryDropDown = ({ category, setCategory }: CategoryDropDownProps) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?c=list'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data.meals.map((meal: any) => meal.strCategory));
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select onChange={(e) => setCategory(e.target.value)} value={category}>
      <option value="All">All</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropDown;
