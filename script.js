document.addEventListener('DOMContentLoaded', function () {
    //Fetch historical data
   fetch('Fdata.json')
        .then(response => response.json())
        .then(data => {
            const financialData = data.financials;

            //Historical data display in a table
            displayHistoricalData(financialData);
            console.log(financialData);
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
    title.textContent = 'Forecast Data';
    forecastContainer.appendChild(title);

    const incomeElement = document.createElement('p');
    incomeElement.textContent = `Average Income: ${forecast.averageIncome.toFixed(2)}`;

    const expensesElement = document.createElement('p');
    expensesElement.textContent = `Average Expenses: ${forecast.averageExpenses.toFixed(2)}`;

    // Append elements to the container
    forecastContainer.appendChild(incomeElement);
    forecastContainer.appendChild(expensesElement);

}



function displayChart(financialData, forecast) {
    //Logic to generate and show a combined chart
    chartContainer = document.getElementById('chartContainer');
    const ctx = document.getElementById('myChart').getContext('2d');


    // Convert dates to a format compatible with Chart.js
    const formattedDates = financialData.map(entry => moment(entry.date).format('YYYY-MM-DD'));
 console.log(formattedDates);
    // Add a label for the forecast
 const labels = formattedDates.concat(['Forecast']);
 console.log(labels);

    const chartData = {
        labels:labels,  // Add a label for the forecast
        datasets: [
            {
                label: 'Income',
                data: financialData.map(entry => entry.income).concat([forecast.averageIncome]),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
                type: 'line',  // Use line type for historical data
            },
            {
                label: 'Expenses',
                data: financialData.map(entry => entry.expenses).concat([forecast.averageExpenses]),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                type: 'bar',  // Use bar type for forecasted data
            },
        ],
    };

    myChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
            scales: {
                x: {
                    //type: 'time',
                    time:{
                        unit:'day',
                        tooltipFormat: 'll',

                    },
                    ticks: {
                       source:'auto',
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
                    text: 'Graph of Historical Data and Forecasted Data'
                }
            }
        }
    });
}
