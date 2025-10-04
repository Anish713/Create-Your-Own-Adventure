import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './StoryList.css';
import {API_BASE_URL} from "../util.js";

function StoryList() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStories, setTotalStories] = useState(0);
    const [storiesPerPage] = useState(6); // 6 stories per page
    const navigate = useNavigate();

    useEffect(() => {
        loadStories();
        loadStoriesCount();
    }, [currentPage]);

    const loadStories = async () => {
        setLoading(true);
        setError(null);

        try {
            const skip = (currentPage - 1) * storiesPerPage;
            const response = await axios.get(`${API_BASE_URL}/stories?skip=${skip}&limit=${storiesPerPage}`);
            setStories(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error loading stories:', err);
            setError('Failed to load stories');
            setLoading(false);
        }
    };

    const loadStoriesCount = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/stories/count`);
            setTotalStories(response.data.count);
        } catch (err) {
            console.error('Error loading stories count:', err);
        }
    };

    const handleStoryClick = (storyId) => {
        navigate(`/story/${storyId}`);
    };

    const handleNewStory = () => {
        navigate('/create');
    };

    const totalPages = Math.ceil(totalStories / storiesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0); // Scroll to top when changing pages
    };

    if (loading) {
        return <div className="story-list">
            <div className="loading">Loading stories...</div>
        </div>;
    }

    if (error) {
        return <div className="story-list">
            <div className="error">{error}</div>
        </div>;
    }

    return (
        <div className="story-list">
            <header className="story-list-header">
                <h1>Available Stories</h1>
                <button onClick={handleNewStory} className="new-story-button">
                    Create New Story
                </button>
            </header>

            {stories.length === 0 ? (
                <div className="no-stories">
                    <p>No stories found. Create your first adventure!</p>
                    <button onClick={handleNewStory} className="primary-button">
                        Generate Your First Story
                    </button>
                </div>
            ) : (
                <>
                    <div className="stories-grid">
                        {stories.map((story) => (
                            <div
                                key={story.id}
                                className="story-card"
                                onClick={() => handleStoryClick(story.id)}
                            >
                                <div className="story-card-content">
                                    <h3>{story.title}</h3>
                                    <p className="story-date">
                                        Created: {new Date(story.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="story-preview">
                                        {story.root_node && story.root_node.content.substring(0, 100)}...
                                    </div>
                                    <div className="story-stats">
                                        <span>Total Nodes: {Object.keys(story.all_nodes).length}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                Previous
                            </button>

                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first, last, current, and nearby pages
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }

                                // Show ellipsis for gaps
                                if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                    return <span key={pageNumber} className="pagination-ellipsis">...</span>;
                                }

                                return null;
                            })}

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default StoryList;