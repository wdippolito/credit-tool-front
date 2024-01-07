import React from 'react';

//component for displaying data in a bar chart.
const BarChart = ({ values }) => {
    const maxValue = Math.max(...values);
    const threshold = 0.315900;

    return (
        <div className="bar-chart">
            {values.map((value, index) => (
                <div key={index} className="bar-in-chart-container">
                   <div
                        className={`bar-in-chart ${value > threshold ? 'bar-above-threshold' : ''}`}
                        style={{ height: `${(value / maxValue) * 100}%` }}
                    >
                        <span className="bar-label">{index}</span>
                    </div>
                </div>  
            ))}
        </div>
    );
};

export default BarChart;
