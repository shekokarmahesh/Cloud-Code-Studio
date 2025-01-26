import { CreatProject } from '../pages/CreateProject'
import './App.css'
import { Route, Routes } from 'react-router-dom'
function App() {


  return (
    <Routes>
      <Route path="/" element={<CreatProject/> }/>
      
    </Routes>
  )
  
}

export default App
