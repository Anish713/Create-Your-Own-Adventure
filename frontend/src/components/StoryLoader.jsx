import {useState, useEffect} from 'react';
import {useParams, useNavigate} from "react-router-dom"
import axios from 'axios';
import LoadingStatus from "./LoadingStatus.jsx";
import StoryGame from "./StoryGame.jsx";
import {API_BASE_URL} from "../util.js";


function StoryLoader() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null);

    useEffect(() => {
        loadStory(id)
    }, [id])

    const loadStory = async (storyId) => {
        setLoading(true)
        setError(null)

        try {
            console.log(`Fetching story with ID: ${storyId}`);
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`)
            console.log('Story response:', response.data);
            setStory(response.data)
            setLoading(false)
        } catch (err) {
            console.error('Error loading story:', err);
            if (err.response?.status === 404) {
                setError("Story is not found.")
            } else {
                setError(`Failed to load story: ${err.message}`)
            }
            setLoading(false)
        }
    }

    const createNewStory = () => {
        navigate("/create")
    }

    const viewAllStories = () => {
        navigate("/stories")
    }

    if (loading) {
        return <LoadingStatus theme={"story"}/>
    }

    if (error) {
        return <div className="story-loader">
            <div className="error-message">
                <h2>Story Not Found</h2>
                <p>{error}</p>
                <button onClick={createNewStory} className="btn">Create New Story</button>
                <button onClick={viewAllStories} className="btn" style={{marginLeft: '10px'}}>View All Stories</button>
            </div>
        </div>
    }

    if (story) {
        return <div className="story-loader">
            <div className="story-nav">
                <button onClick={viewAllStories} className="home-btn">← Back to Stories</button>
            </div>
            <StoryGame story={story} onNewStory={createNewStory}/>
        </div>
    }

    return null;
}

export default StoryLoader;