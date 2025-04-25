import { useEffect } from 'react';
import { useState } from 'react'
import './App.css'

const API_ENDPOINT = "http://localhost:3000/wordle-words" ;
const WORD_LENGTH = 5 ;


function App() {
  const [solution,setSolution] = useState(null) ;

  useEffect(()=>{
    const getData = async () => {
      const response = await fetch(API_ENDPOINT) ;
      const json = await response.json() ;
      const sol = json[Math.floor(Math.random()*json.length)] ;
      setSolution(sol) ;
      console.log(sol);
    }

    getData() ;
  },[]) ;


  return (
    <>
      {solution}
    </>
  )
}

export default App
