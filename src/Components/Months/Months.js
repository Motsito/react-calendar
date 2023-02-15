import {React, useState, useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "./Months.css"
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Months() {

   // months information

   const months = [
      {id:1, name:'January', days:31},
      {id:2, name:'February', days:28},
      {id:3, name:'March', days:31},
      {id:4, name:'April', days:30},
      {id:5, name:'May', days:31},
      {id:6, name:'June', days:30},
      {id:7, name:'July', days:31},
      {id:8, name:'August', days:31},
      {id:9, name:'September', days:30},
      {id:10, name:'October', days:31},
      {id:11, name:'November', days:30},
      {id:12, name:'December', days:31}
   ]

   const [currentMonth, setCurrentMonth] = useState(0)
   const [currentDay, setCurrentDay] = useState(null)


// key listeners for the user to move between days

   useEffect(() => {

      const changeDayWithKey = (event) => {
         if (event.key === 'ArrowRight') {
            setCurrentDay((prevNumber) => prevNumber + 1);
         } else if (event.key === 'ArrowLeft') {
            setCurrentDay((prevNumber) => prevNumber - 1);
         } else if (event.key === 'ArrowUp') {
            setCurrentDay((prevNumber) => prevNumber - 7)
         } else if (event.key === 'ArrowDown') {
            setCurrentDay((prevNumber) => prevNumber + 7)
         }else {
            return
         }
      };

      window.addEventListener('keydown', changeDayWithKey);

      return () => {
         window.removeEventListener('keydown', changeDayWithKey);
      };
   }, []);


   // functions that allow next and back button change month


   const pastMonth = () => {
      if(currentMonth>0){
         setCurrentMonth(currentMonth - 1)
         setCurrentDay(null)
      }else{
         return
      }
   }

   const nextMonth = () => {
      if(currentMonth<11){
         setCurrentMonth(currentMonth + 1)
         setCurrentDay(null)
      }else{
         return
      }
   }


   const createDays = () => {
      const days = [];
      for(let i = 1; i <= months[currentMonth].days; i++){
         days.push(
            <div className={currentDay && currentDay === i ? "currentDay" : "boxContent"} key={i} 
               onClick={
                  ()=>{console.log("yes", i)
                  setCurrentDay(i)
                  console.log(currentDay)
               }
               }>
               <p>{i}</p>
               <div className='dayText'> check</div>
            </div>
         )
      }
      return days


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
               {months[currentMonth].name}
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
            {createDays()}
         </div>
      </div>
   )
}
