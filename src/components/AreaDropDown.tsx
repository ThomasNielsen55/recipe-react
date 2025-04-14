import { useState, useEffect } from 'react';

interface AreaDropDownProps {
  area: string;
  setArea: (area: string) => void;
}

const AreaDropDown = ({ area, setArea }: AreaDropDownProps) => {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await fetch(
          'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setAreas(data.meals.map((meal: any) => meal.strArea));
      } catch (err) {
        setError('Failed to load areas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) return <p>Loading areas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select onChange={(e) => setArea(e.target.value)} value={area}>
      <option value="All">All</option>
      {areas.map((area) => (
        <option key={area} value={area}>
          {area}
        </option>
      ))}
    </select>
  );
};

export default AreaDropDown;
