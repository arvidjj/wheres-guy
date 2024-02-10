import React, { useState } from 'react';

const WinGameModal = ({ elapsedTime, onSendName }) => {
    const [name, setName] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSendName = () => {
        onSendName(name);
    };

    return (
        <div className="modal">
            <h2>Congratulations! You won the game!</h2>
            <p>Elapsed Time: {elapsedTime} seconds</p>
            <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" />
            <button onClick={handleSendName}>Send Name</button>
        </div>
    );
};

export default WinGameModal;