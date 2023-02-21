import { createContext } from "react";

const GlobalContext = createContext({
   appointmentsList: null,
   showModal: false,
   selectedDay: null,
   date: null,
   setDate: () => {},
   setSelectedDay: () => {},
   setAppointmentsList: () => {},
   setShowModal: () => {}
});

export default GlobalContext;

