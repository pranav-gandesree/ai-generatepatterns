'use client'

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FrequencyData {
  term: string;
  frequency: string;
}

interface BarChartProps {
  data: FrequencyData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {

  const chartData = {
    labels: data?.map(item => item.term), 
    datasets: [
      {
        label: 'Frequency',
        data: data?.map(item => parseInt(item.frequency, 10)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)', 
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Frequency Analysis',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `Frequency: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
