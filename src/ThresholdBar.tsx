import React, { useState } from 'react';

//component for displaying threshold bar
interface ThresholdBarProps {
    percentage: number; // Expected to be a value between 0 and 1
}

const ThresholdBar: React.FC<ThresholdBarProps> = ({ percentage }) => {
    const filledPercentage = percentage * 100;

    return (
        <div className="bar-container">
            <div className="bar" style={{ width: `${filledPercentage}%` }}></div>
            <span className="percentage-text">{filledPercentage}%</span>
        </div>
    );
};


export default ThresholdBar;