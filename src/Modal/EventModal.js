import React, { useState, useContext } from 'react';
import { Button, Modal, Form, Row} from 'react-bootstrap';
import GlobalContext from '../context/GlobalContext';

function EventModal(props) {
   const {
      appointmentsList, 
      showModal, 
      selectedDay,
      currentMonth,
      firstDay,
      currentYear,
      setAppointmentsList,
      setShowModal
   } = useContext(GlobalContext); 

   const closeModal = () => setShowModal(false);
   const [lastAppointment, setLastAppointment] = useState(null)
   const [selectedTime, setSelectedTime] = useState(null);
   const getAppointments = (day,month) => {
      return appointmentsList.map((task,index) => {
         let taskDate = new Date(task.time);
         let taskMonth = taskDate.getMonth();
         let taskDay = taskDate.getDate();
         console.log(day)
         if(taskMonth === month && taskDay === day){
            return (<li className='dayblop' variant="secondary" key={month * day * index}>-{task.name}</li>)
         }
      })
   }

   const addAppointment = () => {
      setLastAppointment(prompt('Enter new appointment:'))
   };
   
   const saveAppointment = () => {
      let correctedDayBox = selectedDay-firstDay + 1
      let [hours, minutes] = selectedTime.split(":");
      let isoTime = new Date(currentYear, currentMonth, correctedDayBox, hours, minutes).toISOString();
      let newDate = {time: isoTime , name: lastAppointment}
      const updatedAppointmentsList = [...appointmentsList, newDate];
      setAppointmentsList(updatedAppointmentsList);
      props.onSave(updatedAppointmentsList);
      setLastAppointment(null)
      setSelectedTime(null)
      setShowModal(false);
      localStorage.setItem('appointmentsList', JSON.stringify(updatedAppointmentsList));
   };


   return (
         <>
         <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
               <Modal.Title>Add Appointment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className='d-flex mt-1 mb-3 justify-content-between w-100'>
            <div className='d-flex'>
               {lastAppointment ? <h4>{lastAppointment} </h4> : <h4>Date today?</h4> }
            </div>
            <Form.Control className='w-50' size="lg" type="time" onChange={(event)=>{setSelectedTime(event.target.value)}} value={selectedTime || ''} />
            </div>
               <Button variant="secondary" onClick={addAppointment}>
               Add Another
               </Button>
               <div className='my-3 mx-3'>
                  <h2>Today To Do's:</h2>
                  <ul>
                     {
                        getAppointments(selectedDay - 2, currentMonth)
                     }
                  </ul>
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={closeModal}>
               Cancel
               </Button>
               <Button variant="primary" onClick={saveAppointment}>
               Save
               </Button>
            </Modal.Footer>
         </Modal>
         </>
      );
   }

   export default EventModal;