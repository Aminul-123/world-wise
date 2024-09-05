import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
 import App from './App.jsx'
 import './index.css'
import { BrowserRouter } from 'react-router-dom'
// import StarRating from './assets/StarRating'

// function Test () {
//   return (
//     <div>
//       <StarRating color='blue' maxRating={10}   />
      
//     </div>
//   )
// }

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
       <App />
    </BrowserRouter>
    {/* <StarRating maxRating={5} messages = {['Terrible', 'Bad', 'Okay' , 'Good',  
      'Amazing'
    ]} />
    <StarRating maxRating = {5} size={24}  color='red' className = 'test' defaultRating={3} />

    <Test /> */}
   
  </React.StrictMode>,
)
