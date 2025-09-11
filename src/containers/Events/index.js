import { useMemo, useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(); // undefined = Toutes
  const [currentPage, setCurrentPage] = useState(1);

  const events = Array.isArray(data?.events) ? data.events : [];

  // Liste des catégories disponibles
  const typeList = useMemo(
    () => Array.from(new Set(events.map((e) => e.type))),
    [events]
  );

  // Filtrage dynamique (sans muter la source)
  const filteredEvents = useMemo(
    () =>
      !type
        ? events
        : events.filter(
            (e) =>
              String(e.type).toLowerCase() === String(type).toLowerCase()
          ),
    [events, type]
  );

  // Pagination
  const pageCount = Math.max(1, Math.ceil(filteredEvents.length / PER_PAGE));
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filteredEvents.slice(start, start + PER_PAGE);

  // Pages (sans index comme key)
  const pages = useMemo(
    () => Array.from({ length: pageCount }, (_, i) => i + 1),
    [pageCount]
  );

  const handleSelect = (evtType) => {
    setCurrentPage(1);
    setType(evtType || undefined);
  };

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={handleSelect}
            name="event-type"
            label="Catégories"
          />

          {/* ⬇️ Conteneur avec la bonne classe pour 3 cartes par ligne */}
          <div id="events" className="ListContainer">
            {pageItems.map((event) => (
              <Modal
                key={event.id ?? event.title}
                Content={<ModalEvent event={event} />}
              >
                {({ setIsOpened }) => (
                  <EventCard
                    imageSrc={event.cover}
                    imageAlt={event.title}
                    date={new Date(event.date)}
                    title={event.title}
                    label={event.type}
                    onClick={() => setIsOpened(true)}
                  />
                )}
              </Modal>
            ))}
          </div>

          <div className="Pagination">
            {pages.map((p) => (
              <a key={`page-${p}`} href="#events" onClick={() => setCurrentPage(p)}>
                {p}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
