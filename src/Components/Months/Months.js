import {React, useState, useEffect, useContext} from 'react'
import "./Months.css";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import GlobalContext from "../../context/GlobalContext"

export default function Months() {

   const { 
      appointmentsList, 
      showModal, 
      selectedDay,
      currentMonth,
      date,
      firstDay,
      setFirstDay,
      currentYear,
      setCurrentYear,
      setCurrentMonth,
      setSelectedDay,
      setShowModal
   } = useContext(GlobalContext);


   // months information

   const months = [
      'January', 
      'February', 
      'March', 
      'April', 
      'May', 
      'June', 
      'July', 
      'August', 
      'September', 
      'October', 
      'November', 
      'December'
   ];

   const [monthboxes, setMonthBoxes] = useState(Array.from(
      { length: 42 }, (_, i) => (
         { 
            id: i + 1
         }
      )))
      const [clickCount, setClickCount] = useState(0);
// key listeners for the user to move between days

   useEffect(() => {
      const changeDayWithKey = (event) => {
         if (event.key === 'ArrowRight') {
            setSelectedDay((prevNumber) => prevNumber + 1);
         } else if (event.key === 'ArrowLeft') {
            setSelectedDay((prevNumber) => prevNumber - 1);
         } else if (event.key === 'ArrowUp') {
            setSelectedDay((prevNumber) => prevNumber - 7)
         } else if (event.key === 'ArrowDown') {
            setSelectedDay((prevNumber) => prevNumber + 7)
         }else {
            return
         }
      };

      window.addEventListener('keydown', changeDayWithKey);

      return () => {
         window.removeEventListener('keydown', changeDayWithKey);
      };
   }, []);

   const boxClick = (index, currentBox,currentDays) => {

      if (clickCount === 1) {
         setShowModal(true);
      } else if (clickCount > 1 || index !== setSelectedDay) {
         setClickCount(0);
         setShowModal(false)
      }
      if(index >= firstDay && currentBox <= currentDays ){
         setSelectedDay(index);
      }else{
         setClickCount(0);
         setShowModal(false)
         return 
      }

   setClickCount((prev)=>prev + 1);

      
   };

   //function that gives ammount of days based in date methods

   const getAmmountDays = (year, month) => {
      const firstDayOfNextMonth = new Date(year, month + 1, 1);
      const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
      const daysInMonth = lastDayOfMonth.getDate();
      return daysInMonth
   }
   
   // functions that allow next and back button change month

   const pastMonth = () => {
      if(currentMonth > 0 && currentMonth <= 11){
         setCurrentMonth((prev)=>{return prev - 1})
         setFirstDay(new Date(currentYear, currentMonth - 1, 1).getDay())
         setSelectedDay(null)
      }else if (currentMonth === 0){
         setCurrentMonth(11)
         setCurrentYear((prev) => prev - 1)
         setFirstDay(new Date(currentYear - 1, 11, 1).getDay())
         setSelectedDay(null)
      }
   }

   const nextMonth = () => {
      console.log(appointmentsList)
      if(currentMonth >= 0 && currentMonth <= 10){
         setCurrentMonth((prev)=>{return prev + 1})
         setFirstDay(new Date(currentYear, currentMonth + 1, 1).getDay())
         setSelectedDay(null)
      }else if (currentMonth === 11){
         setCurrentMonth(0)
         setCurrentYear((prev) => prev + 1)
         setFirstDay(new Date(currentYear + 1, 0, 1).getDay())
         setSelectedDay(null)
      }
   }



//function that will add the needed class for the specific day

   const getClassNames = (dayIndex, currentBox, currentDays, notAvailableDaysHelper) => {
      const classNames = {
         boxContent: true,
         grayBox: notAvailableDaysHelper,
         currentDay : selectedDay === dayIndex,
         today: date.getDate() === currentBox - firstDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear
   }

   return Object.keys(classNames)
   .filter((className) => classNames[className])
   .join(" ");
}

//function that will add the needed number for the specific day

const getDayNumber = (index, 
   currentBox, 
   currentDays,
   pastMonthDays
   ) => {
   if(currentBox <= firstDay){
      return pastMonthDays - firstDay + currentBox;
      }else if(currentBox > firstDay && currentBox <= (currentDays+firstDay)){
         return currentBox - firstDay
      }else if (currentBox > (currentDays+firstDay)){
         return currentBox - firstDay - currentDays
      }
   return currentBox
}
   //function that retrieves appointments info
   const getAppointments = (index,day,month) => {
      return appointmentsList.map((task) => {
         let taskDate = new Date(task.time);
         let taskMonth = taskDate.getMonth();
         let taskDay = taskDate.getDate();
         if(taskMonth === month && taskDay === day){
            return (<span className='dayText' key={Math.floor(Math.random() * index)}>{task.name}</span>)
         }
      })
   }

//********************          tryall             ********************

const makeDays = () =>{
   return monthboxes.map((_, index)=>{
      let currentBox = index + 1;
      let currentDays = getAmmountDays(currentYear, currentMonth);
      let notAvailableDaysHelper = (currentBox <= firstDay) || currentBox < firstDay || currentBox > (currentDays + firstDay)
      let pastMonthDays = () =>{
         if(currentMonth > 0 && currentMonth <= 11){
            return getAmmountDays(currentYear, currentMonth - 1)
         }else if (currentMonth === 0){
            return getAmmountDays(currentYear - 1, 11)
         }
      }
      return(
         <div className={
            getClassNames(
               index, 
               currentBox, 
               currentDays, 
               notAvailableDaysHelper
            )} 
            key={index} 
            onClick={()=>{
               boxClick(
                  index,
                  currentBox - firstDay,
                  currentDays)}
            }
         >
         <p>{getDayNumber(
               index, 
               currentBox, 
               currentDays,
               pastMonthDays(),
            )}
         </p>
         <div>
               {
                  getAppointments(index, currentBox - firstDay, currentMonth)
               }
         </div>
      </div>
      )
   })

}

   return (
      <div className='borderGrid my-3'> 
         <div>
            <Row className='text-center mb-2'>
               <Col xs>
                  <Button variant="primary border" size="lg" className='px-5 py-2' onClick={()=>pastMonth()}>
                     {`<`}
                  </Button>
               </Col>
               <Col>
                  <h2>{months[currentMonth]}  {currentYear}</h2>
               </Col>
               <Col xs>
                  <Button variant="primary border" size="lg" className='px-5 py-2' onClick={()=>nextMonth()}>
                     {`>`}
                  </Button>
               </Col>
               
            </Row>
         </div>
         <div className='grid'>
            <p className='dayBox'>Sun</p>
            <p className='dayBox'>Mon</p>
            <p className='dayBox'>Tue</p>
            <p className='dayBox'>Wed</p>
            <p className='dayBox'>Thu</p>
            <p className='dayBox'>Fri</p>
            <p className='dayBox'>Sat</p>
            {makeDays()}
         </div>
      </div>
   )
}
