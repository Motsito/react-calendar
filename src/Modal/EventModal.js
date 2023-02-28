import React, { useState, useContext } from 'react';
import { Button, Modal, Form} from 'react-bootstrap';
import GlobalContext from '../context/GlobalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark} from '@fortawesome/free-solid-svg-icons'

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

   //show modal
   const [notTimeSelected, setNotTimeSelected] = useState(null)
   const [addApBol, setAddApBol] = useState(false)
   const closeModal = () =>{
      setAddApBol(false);
      setShowModal(false);
      setNotTimeSelected(null)
   }

   //appointment settings
   const [lastAppointment, setLastAppointment] = useState(null)
   const [selectedTime, setSelectedTime] = useState(null);

   const getAppointments = (day, month) => {
      const dayAppointments = appointmentsList.filter(
         (task) => new Date(task.time).getDate() === day && new Date(task.time).getMonth() === month
      ).sort((a, b) => {
         return new Date(a.time) - new Date(b.time);
      });
      
      console.log(dayAppointments)
      return dayAppointments.map((task, index) => {
         let taskDate = new Date(task.time);
         let getHours = taskDate.getHours() < 10 ? `0${taskDate.getHours()}` : taskDate.getHours();
         let getMinutes = taskDate.getMinutes() < 10 ? `0${taskDate.getMinutes()}` : taskDate.getMinutes();
         let taskTime = getHours + ":" + getMinutes;
         return (
            <div className='onModalDayText px-2' key={Math.floor(Math.random() * index)}>
            <span>{task.name}</span>
            <div>
               <span>{taskTime} </span>
               <Button className='mb-1 ms-2' variant="danger" size="sm" onClick={() => {deleteAppointment(appointmentsList[index].name)}}>
                  <FontAwesomeIcon icon={faXmark} size="lg" />
               </Button>
            </div>
            </div>
         )
      })
   }
      

   //function that allows user delete appointments

   const deleteAppointment = (name) =>{
      const newList = appointmentsList.filter((appointment)=>appointment.name !== name);
      setAppointmentsList(newList)
   }

   const addTitle = () => {
      setLastAppointment(prompt('Enter new appointment:'))
   };

   const addAppointment = () => {
      setAddApBol(true)
   }

   const saveAppointment = () => {
      if(addApBol===true){
         if(selectedTime){
            let correctedDayBox = selectedDay - firstDay + 1
            let [hours, minutes] = selectedTime.split(":");
            let isoTime = new Date(currentYear, currentMonth, correctedDayBox, hours, minutes).toISOString();
            let newDate = {time: isoTime , name: lastAppointment}
            const updatedAppointmentsList = [...appointmentsList, newDate];
            setAppointmentsList(updatedAppointmentsList);
            props.onSave(updatedAppointmentsList);
            setLastAppointment(null);
            setSelectedTime(null);
            setShowModal(false);
            setAddApBol(false);
            setNotTimeSelected(false);
            localStorage.setItem('appointmentsList', JSON.stringify(updatedAppointmentsList));
         }else{
            setNotTimeSelected(true)
         }

      }else{
         setShowModal(false);
         setAddApBol(false);
         const updatedAppointmentsList = [...appointmentsList];
         props.onSave(updatedAppointmentsList);
         localStorage.setItem('appointmentsList', JSON.stringify(updatedAppointmentsList));
      }

   };


   return (
         <>
         <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
               <Modal.Title><h1>Today To Do's:</h1></Modal.Title>
            </Modal.Header>

            <Modal.Body>
            <div className='my-3 mx-3'>
                  {
                     getAppointments(selectedDay - 2, currentMonth)
                  }
            </div>

         {addApBol === true ? 
            <>
               <div className='d-flex justify-content-between w-100 mt-4 mb-3'>
                  {lastAppointment ? <h4>{lastAppointment} </h4> : <h4>Date today?</h4> }
                  <Form.Control className='w-50' size="lg" type="time" onChange={(event)=>{setSelectedTime(event.target.value)}} value={selectedTime || ''} />
               </div>
               <Button className='ms-2' variant="secondary" onClick={addTitle}>
                  Add Title
               </Button>
               {notTimeSelected === true ? <p className="alert alert-danger text-sm my-3 p-2">Select a time.</p> : <></>}
            </>:
            <Button variant="secondary" onClick={()=>addAppointment()}>
               Add Another
            </Button>
            }

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