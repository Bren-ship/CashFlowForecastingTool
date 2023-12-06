document.addEventListener('DOMContentLoaded', function () {
    //Fetch historical data
   fetch('Fdata.json')
        .then(response => response.json())
        .then(data => {
            const financialData = data.financials;

            //Historical data display in a table
            displayHistoricalData(financialData);

            //Forecast calculation and display
            const forecast = calculateForecast(financialData);
            console.log(forecast);
            displayForecast(forecast);

               //Basic chart display
            displayChart(financialData, forecast);

        })
        .catch(error => console.error('Error fetching data:', error));
    
});




function displayHistoricalData(data){
    //Logic to create and include a table for historical data
    const tableContainer = document.getElementById('historical-data');

    const table = document.createElement('table');

    const headerRow = table.insertRow();
    for (const key in data[0]) {
        const th = document.createElement('th');
        th.textContent = key;
        headerRow.appendChild(th);
    }

     // Rows for each data entry
     data.forEach(entry => {
        const row = table.insertRow();
        for (const key in entry) {
            const cell = row.insertCell();
            cell.textContent = entry[key];
        }
    });

    // Append the table to the container
    tableContainer.appendChild(table);
}

function calculateForecast(data){
    //Basic forecast logic(avg monthly income and expenses)
    const totalIncome = data.reduce((acc, entry) => acc + entry.income, 0);
    const totalExpenses = data.reduce((acc, entry) => acc + entry.expenses, 0);
    const averageIncome = totalIncome / data.length;
    const averageExpenses = totalExpenses / data.length;

    return {
        averageIncome,
        averageExpenses
    };

}

function displayForecast(forecast){
    //Forecast data display logic
    const forecastContainer = document.getElementById('forecastContainer');

    // Clear previous content
    forecastContainer.innerHTML = '';

    // Create elements to display forecast
    const title = document.createElement('h2');
    title.textContent = 'Historical Data';
    forecastContainer.appendChild(title);

    const incomeElement = document.createElement('p');
    incomeElement.textContent = `Average Income: ${forecast.averageIncome.toFixed(2)}`; // Format to two decimal places
    forecastContainer.appendChild(incomeElement);

    const expensesElement = document.createElement('p');
    expensesElement.textContent = `Average Expenses: ${forecast.averageExpenses.toFixed(2)}`; // Format to two decimal places
    forecastContainer.appendChild(expensesElement);

}



function displayChart(financialData, forecast) {
    //Logic to generate and show a combined chart
    chartContainer = document.getElementById('chartContainer');
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart;

    // Convert dates to a format compatible with Chart.js
    const formattedDates = financialData.map(entry => moment(entry.date).format('YYYY-MM-DD'));

    const chartData = {
        labels: formattedDates,
        datasets: [
            {
                label: 'Income',
                data: financialData.map(entry => entry.income),
                type: 'bar',
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Expenses',
                data: financialData.map(entry => entry.expenses),
                type: 'bar',
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Forecast Income',
                data: Array(financialData.length).fill(forecast.averageIncome),
                type: 'line',
                borderColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Forecast Expenses',
                data: Array(financialData.length).fill(forecast.averageExpenses),
                type: 'line',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                fill: false
            }
        ]
    };

    myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return moment(value).format('MMM DD');
                        }
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount'
                    }
                }
            },
            elements: {
                line: {
                    tension: 0
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Graph of Historical Data against Forecasted Data'
                }
            }
        }
    });
}
