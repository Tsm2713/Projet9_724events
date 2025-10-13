import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";
import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const eventsAll = data?.events || [];
  const typeList = Array.from(new Set(eventsAll.map((event) => event.type)));

  const eventsByType = type ? eventsAll.filter((event) => event.type === type) : eventsAll;
  const eventsSorted = [...eventsByType].sort((a, b) => new Date(b.date) - new Date(a.date));

  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedEvents = eventsSorted.slice(startIndex, startIndex + PER_PAGE);

  const pageNumber = Math.ceil(eventsByType.length / PER_PAGE);
  const pages = Array.from({ length: pageNumber }, (_, i) => i + 1);

  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
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
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {pages.map((page) => (
              <a key={`page-${page}`} href="#events" onClick={() => setCurrentPage(page)}>
                {page}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
