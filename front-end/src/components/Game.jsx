import React, { useState, useEffect } from 'react';
import apiInstance from '../../apiInstance';
import API_CONFIG from '../../apiConfig';

const Game = () => {

    const [imageSrc, setImageSrc] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [shouldRenderClickBoxes, setShouldRenderClickBoxes] = useState(false);

    const [characters, setCharacters] = useState([]);
    const [clickLocation, setClickLocation] = useState([]);
    const [hitboxSize, setHitboxSize] = useState([]);

    const [clickBoxes, setClickBoxes] = useState([]);

    const [lastClicked, setLastClicked] = useState(null);
    const [timesClicked, setTimesClicked] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [hasWon, setHasWon] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await apiInstance.get('/images/random');

                if (response.status === 200) {
                    const imageUrl = API_CONFIG.baseURL + '/images/' + response.data.image;
                    setImageId(response.data['_id']);
                    setImageSrc(imageUrl);
                    setCharacters(response.data.character);
                    setClickLocation(response.data.clickLocation);
                    setHitboxSize(response.data.hitboxSize);
                } else {
                    console.error('Failed to fetch image from the backend');
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, []);

    const createClickBox = (position, character) => {

        return (
            <div
                key={`${position.x}-${position.y}`}
                id={`${position.x}-${position.y}`}
                style={{
                    position: 'absolute',
                    left: position.x - 25,
                    top: position.y - 25,
                    width: 50,
                    height: 50,
                    border: '2px solid blue',
                    boxSizing: 'border-box',
                }}
            >
                <div key={`${position.x}-${position.y}`}>
                    <select onChange={(event) => handleCharacterSelection({ x: position.x, y: position.y }, event.target.value)}>
                        <option value={null}>Select a Character</option>
                        {characters.map((char) => (
                            <option key={char} value={char}>
                                {char}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const handleCharacterSelection = (coordinates, character) => {
        const [x, y] = [coordinates.x, coordinates.y];
        const hitboxSize = { height: 50, width: 50 };

        const hitData = {
            character: JSON.stringify(character),
            clickLocation: JSON.stringify(coordinates),
            hitboxSize: JSON.stringify(hitboxSize),
            imageId: imageId,
        };

        apiInstance.post('/validate', hitData)
            .then(response => {
                console.log(response.data.message); // Success message
            })
            .catch(error => {
                console.error(error.response.data.error); // Error message
            });
    }

    const handleClick = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        if (!hasStarted) {
            setHasStarted(true);
        }
        const newClickBox = createClickBox({ x: offsetX, y: offsetY });

        if (!(clickBoxes.length > characters.length)) {
            setClickBoxes((prevClickBoxes) => [...prevClickBoxes, newClickBox]);
        }

        setTimesClicked((prevTimesClicked) => prevTimesClicked + 1);
    };


    const resetGame = () => {
        setHasWon(false);
        setHasStarted(false);
        setTimesClicked(0);
        setClickBoxes([]);
    };

    return (
        <div className="game-container">
            <h1>Find the Character!</h1>

            <div style={{ position: 'relative' }} id="imageDiv">
                <img
                    src={imageSrc}
                    alt="Find the Character"
                    onClick={handleClick}
                    className={hasWon ? 'won mainimage' : 'mainimage'}
                />
                {clickBoxes.map((clickBox) => clickBox)}
            </div>

            {hasStarted && (
                <div>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            )}
        </div>
    );
};

export default Game;
