import { useState } from 'react'
import './App.css'
import Game from './components/Game'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center'>
          <h1>Where's this guy</h1>
      </div>
      
      <div className="body">
          <Game />
      </div>

      <footer className="read-the-docs">
        Arvid 2024
      </footer>
    </>
  )
}

export default App
