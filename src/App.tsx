import React from 'react'
import './App.css'
import { usePrompt } from './prompt'

export const App = () => {
  const { Outlet, render, isActive, clear } = usePrompt<'yes' | 'no'>();

  const renderPrompt = () => render((_, anwser) => (
    <div>
      <div>
        Sure?
      </div>
      
      <button onClick={() => anwser('yes')}>Yes</button>
      <button onClick={() => anwser('no')}>No</button>
    </div>
  ))

  return (
    <div className="App">
      <button onClick={isActive ? clear : renderPrompt}>
        Delete
      </button>

      <dialog open={isActive}>
        <Outlet />
      </dialog>
    </div>
  )
}

export default App
