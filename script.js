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

    // Create elements to display forecast
    const incomeElement = document.createElement('p');
    incomeElement.textContent = `Average Income: ${forecast.averageIncome}`;

    const expensesElement = document.createElement('p');
    expensesElement.textContent = `Average Expenses: ${forecast.averageExpenses}`;

    // Append elements to the container
    forecastContainer.appendChild(incomeElement);
    forecastContainer.appendChild(expensesElement);
}

function displayChart(financialData, forecast){
    //Logic to generate and show a basic chart
    let chartContainer;
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
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Expenses',
                data: financialData.map(entry => entry.expenses),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Forecast Income',
                data: Array(financialData.length).fill(forecast.averageIncome),
                borderColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: false
            },
            {
                label: 'Forecast Expenses',
                data: Array(financialData.length).fill(forecast.averageExpenses),
                borderColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
                fill: false
            }
        ]
    };

    myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}