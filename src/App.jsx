import { Link } from 'react-router-dom'
import './App.scss'

function App() {
  return (
    <div className="app">
      <h1>Homepage</h1>
      <nav>
        <Link to="/about">About</Link> | <Link to="/contact">Contact</Link>
      </nav>
    </div>
  )
}

export default App
