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
   const [selectedDay, setSelectedDay] = useState(null)
   const [currentMonth, setCurrentMonth] = useState(0)
   const [currentYear, setCurrentYear] = useState(2022)
   const [firstDay, setFirstDay] = useState(1);
   const [lastDay, setLastDay] = useState((months[currentMonth].days + firstDay) % 7 + 1)

   const monthTryal = Array.from(
      { length: 42 }, (_, i) => (
         { 
            id: i + 1, 
            date: "",//`${currentYear}-${(currentMonth+1) <= 9 ? "0" + (currentMonth+1) : (currentMonth+1)}-${(i+1) <= 9 ? "0" + (i+1) : (i+1)}`, 
            content: [], 
            type: "",//("current") ? "boxContent" : "grayBox boxContent"
         }
      ));

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

   // functions that allow next and back button change month


   const pastMonth = () => {
      if(currentMonth>0){
         setCurrentMonth(currentMonth - 1)
         setSelectedDay(null)
      }else{
         return
      }
   }

   const nextMonth = () => {
      if(currentMonth<11){
         setCurrentMonth(currentMonth + 1)
         setSelectedDay(null)
         setFirstDay((months[currentMonth].days % 7))
         console.log(firstDay)
      }else{
         return
      }
   }

//function that will add the needed class for the specific day


const getClassNames = (dayIndex, currentBox, currentDays, notAvailableDaysHelper) => {
   const classNames = {
      boxContent: true,
      currentDay : selectedDay === dayIndex,
      grayBox: notAvailableDaysHelper
   }

   return Object.keys(classNames)
   .filter((className) => classNames[className])
   .join(" ");
}

//function that will add the needed number for the specific day

const getDayNumber = (index, 
   currentBox, 
   currentDays, 
   notAvailableDaysHelper
   ) => {
   if(currentBox <= firstDay){
      console.log("primer dia", firstDay, "caja actual", currentBox)
      return currentBox
      }else if(currentBox > firstDay && currentBox <= (currentDays+firstDay)){
         return currentBox - firstDay
      }else if (currentBox > (currentDays+firstDay)){
         return currentBox - firstDay - currentDays
      }

   return currentBox
}

//********************          tryall             ********************


const makeDays = () =>{
   return monthTryal.map((_, index)=>{
      let currentBox = index + 1;
      let currentDays = months[currentMonth].days;
      let notAvailableDaysHelper = (firstDay !== 1 && currentBox <= firstDay) || currentBox < firstDay || currentBox > currentDays
      return(
         <div className={
            getClassNames(
               index, 
               currentBox, 
               currentDays, 
               notAvailableDaysHelper
            )} 
            key={index} 
            onClick={()=>{setSelectedDay(index)}
            }
         >
         <p>{getDayNumber(
               index, 
               currentBox, 
               currentDays, 
               notAvailableDaysHelper
            )}
         </p>
         <div className='dayText'>
            <ul>{monthTryal[1].content
                  .map((task,indexes) => {
                     return (
                           <li>{monthTryal[1].content[indexes]}</li>
                     )
                  })}
                  {monthTryal[index].date}
            </ul>
         </div>
      </div>
      )
   })

}


// function that generates  day boxes
   // const createDays = () => {
   //    const days = [];

   //    for(let i = 1; i <= months[currentMonth].days; i++){
   //       days.push(
   //          <div className={getClassNames(i)} key={i} 
   //             onClick={
   //                ()=>{console.log("yes", i)
   //                setSelectedDay(i)
   //                console.log(selectedDay)
   //             }
   //             }>
   //             <p>{i}</p>
   //             <div className='dayText'> check</div>
   //          </div>
   //       )
   //    }
   //    return days
   // }
   return (
      <div className='borderGrid'> 
         <div>
            <Row className='monthName mb-2'>
               <Col xs lg="2">
                  <Button variant="light border" onClick={()=>pastMonth()}>Back</Button>
                  <Button variant="light border" onClick={()=>nextMonth()}>Next</Button>
               </Col>
               <Col xs lg="8">
               {months[currentMonth].name}{firstDay}
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
