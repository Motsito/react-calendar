import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css';
import Months from './Components/Months/Months';
import GlobalContext from './context/GlobalContext';
import EventModal from './Modal/EventModal';

function App() {

   const [appointmentsList, setAppointmentsList] = useState(
   JSON.parse(localStorage.getItem('appointmentsList')) || 
   [
      {
         "time":"2023-02-20T18:45:00+00:00",
         "name":"Coffee Break"
      },
      {
         "time":"2023-02-21T18:45:00+00:00",
         "name":"Brainstorming"
      },
      {
         "time":"2023-02-24T18:45:00+00:00",
         "name":"PRD deploy"
      },
      {
         "time":"2023-02-28T11:15:00+00:00",
         "name":"Daily scrum"
      }
   ]);
   const [showModal, setShowModal] = useState(false);
   const [date, setDate] = useState(new Date())
   const [selectedDay, setSelectedDay] = useState (null)
   const [currentMonth, setCurrentMonth] = useState(date.getMonth())
   
   const [currentYear, setCurrentYear] = useState(date.getFullYear())
   const [firstDay, setFirstDay] = useState(new Date(currentYear, currentMonth, 1).getDay());   
   const saveAppointment = (appointments) => {
      console.log('Saved appointments:', appointments);
   };

   return (
      <GlobalContext.Provider 
      value={
         {appointmentsList,
         showModal, 
         selectedDay, 
         date, 
         currentMonth,
         firstDay, 
         currentYear, 
         setFirstDay, 
         setCurrentYear, 
         setDate, 
         setSelectedDay, 
         setCurrentMonth, 
         setAppointmentsList, 
         setShowModal
         }
      }
      >
         <div className="App">
            <Months />
            <EventModal onSave={saveAppointment}  />
         </div>
      </GlobalContext.Provider>
   );
}

export default App;
