import { useEffect, useMemo, useState } from "react";
import { useData } from "../../contexts/DataContext";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Tri par date décroissante + on garde 3 items
  const items = useMemo(() => {
    const focus = Array.isArray(data?.focus) ? data.focus : [];
    return focus
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  }, [data]);

  // Si la liste change et que l'index dépasse, on reset
  useEffect(() => {
    if (index >= items.length && items.length > 0) {
      setIndex(0);
    }
  }, [index, items.length]);

  // Auto-play toutes les 5s (cleanup systématique)
  useEffect(() => {
    if (!items.length) {
      return () => {};
    }
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [index, items.length]);

  if (!items.length) return null;

  return (
    <div className="SlideCardList" aria-label="slider">
      {items.map((event, idx) => (
        <div
          key={event.id ?? event.title ?? event.cover ?? event.date}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
               <div>{new Date(event.date).toLocaleString('fr-FR', { month: 'long' })}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination" role="tablist" aria-label="slider bullets">
          {items.map((event, bulletIdx) => (
            <input
              key={`bullet-${event.id ?? event.title ?? event.cover ?? event.date}`}
              type="radio"
              name="radio-button"
              aria-label={`slide ${bulletIdx + 1}`}
              checked={bulletIdx === index}
              onChange={() => setIndex(bulletIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
