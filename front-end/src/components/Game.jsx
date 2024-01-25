import React, { useState, useEffect } from 'react';
import apiInstance from '../../apiInstance';

const Game = () => {
    const [correctPosition, setCorrectPosition] = useState({ x: 500, y: 500 });
    const [clickPosition, setClickPosition] = useState(null);
    const [timesClicked, setTimesClicked] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    const createClickBox = () => {
        const { x, y } = correctPosition;
        const boxSize = 20; // Adjust the size of the clickable box
        return (
            <div
                style={{
                    position: 'relative',
                    left: (x - boxSize / 2),
                    top: -(y - boxSize / 2),
                    width: boxSize,
                    height: boxSize,
                    backgroundColor: 'rgba(255, 0, 0, 0.3)', // Semi-transparent red
                }}
                onClick={() => handleCorrectClick()}
            />
        );
    }

    const handleCorrectClick = () => {
        setTimesClicked(timesClicked + 1);
        setHasWon(true);
    };

    const handleClick = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        if (!hasStarted) {
            setHasStarted(true);
        }
        setTimesClicked(timesClicked + 1);
        setClickPosition({ x: offsetX, y: offsetY });
    };

    const resetGame = () => {
        setHasWon(false);
        setHasStarted(false);
        setTimesClicked(0);
        setClickPosition(null);
    };

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await apiInstance.get('/images');
                if (response.status === 200) {
                    const imageUrl = URL.createObjectURL(new Blob([response.data]));
                    setImageSrc(imageUrl);
                } else {
                    console.error('Failed to fetch image from the backend');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, []);

    const [imageSrc, setImageSrc] = useState(null);

    return (
        <div className="game-container">
            <h1>Where's Waldo?</h1>
            {hasStarted && <nav>Times clicked: {timesClicked}</nav>}

            <div>
                <img
                    src={imageSrc}
                    alt="Where's Waldo"
                    onClick={handleClick}
                    className={hasWon ? 'won mainimage' : 'mainimage'}
                />
                {hasStarted && createClickBox()} {/* Show the click box only when the game has started */}
            </div>


            {hasWon && (
                <div>
                    <p>Congratulations! You found Waldo!</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Game;
