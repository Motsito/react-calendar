import {React, useState, useEffect, useContext} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
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

   const boxClick = (index, currentBox, currentMonth, currentYear) => {

      if (clickCount === 1) {
         setShowModal(true);
      } else if (clickCount > 1 || index !== setSelectedDay) {
         setClickCount(0);
         setShowModal(false)
      }
      setClickCount((prev)=>prev + 1);
      setSelectedDay(index);
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

   //function that retrieves appointments info
   const getAppointments = (index,day,month) => {
      return appointmentsList.map((task) => {
         let taskDate = new Date(task.time);
         let taskMonth = taskDate.getMonth();
         let taskDay = taskDate.getDate();
         if(taskMonth === month && taskDay === day){
            return (<li className='dayblop' variant="secondary" key={index*month*day}>-{task.name}</li>)
         }
      })
   }


//function that will add the needed class for the specific day

   const getClassNames = (dayIndex, currentBox, currentDays, notAvailableDaysHelper) => {
      const classNames = {
         boxContent: true,
         currentDay : selectedDay === dayIndex,
         grayBox: notAvailableDaysHelper,
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
                  currentMonth,
                  currentYear)}
            }
         >
         <p>{getDayNumber(
               index, 
               currentBox, 
               currentDays,
               pastMonthDays(),
            )}
         </p>
         <div className='dayText'>
            <ul>
               {
                  getAppointments(index, currentBox - firstDay, currentMonth)
               }
            </ul> 
         </div>
      </div>
      )
   })

}

   return (
      <div className='borderGrid'> 
         <div>
            <Row className='monthName mb-2'>
               <Col xs lg="2">
                  <Button variant="light border" onClick={()=>pastMonth()}>Back</Button>
                  <Button variant="light border" onClick={()=>nextMonth()}>Next</Button>
               </Col>
               <Col xs lg="8">
               {months[currentMonth]}
               </Col>
               <Col>{currentYear}</Col>
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
