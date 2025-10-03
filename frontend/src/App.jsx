import './App.css'
import {BrowserRouter as Router, Routes, Route, Link, Navigate} from "react-router-dom"
import StoryLoader from "./components/StoryLoader"
import StoryGenerator from "./components/StoryGenerator.jsx"
import StoryList from "./components/StoryList.jsx"

function App() {
    return (
        <Router>
            <div className="app-container">
                <header>
                    <h1>Interactive Story Generator</h1>
                    <nav style={{marginTop: '1rem'}}>
                        <Link to="/stories" style={{margin: '0 10px', textDecoration: 'none', color: '#4a6fa5'}}>Explore
                            Stories</Link>
                        <Link to="/create" style={{margin: '0 10px', textDecoration: 'none', color: '#4a6fa5'}}>Create
                            Story</Link>
                    </nav>
                </header>
                <main>
                    <Routes>
                        <Route path={"/story/:id"} element={<StoryLoader/>}/>
                        <Route path={"/create"} element={<StoryGenerator/>}/>
                        <Route path={"/stories"} element={<StoryList/>}/>
                        <Route path={"/"} element={<Navigate to="/stories" replace/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App