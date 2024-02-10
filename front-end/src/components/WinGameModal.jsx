import React, { useState } from 'react';

const WinGameModal = ({ elapsedTime, onSendName, isLoading  }) => {
    const [name, setName] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleSendName = () => {
        onSendName(name);
    };

    return (
        <div className="modal items-center justify-center">
            <div className='flex flex-col items-center gap-5'>
                <h2 className='text-3xl'>Congratulations! You won the game!</h2>
                <p>Elapsed Time: {elapsedTime} seconds</p>
                <input type="text" className='p-2' value={name} onChange={handleNameChange} placeholder="Enter your name" />
                {isLoading ? (
                    <button className='p-2 rounded-md text-white disabled' disabled>Loading...</button>
                ) : (
                    <button className='bg-green-500 p-2 rounded-md text-white' onClick={handleSendName}>Send Score</button>
                )}
            </div>
        </div>
    );
};

export default WinGameModal;