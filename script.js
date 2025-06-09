document.addEventListener("DOMContentLoaded", function () {
  //Fetch historical data
  fetch("Fdata.json")
    .then((response) => response.json())
    .then((data) => {
      const financialData = data.financials;

      //Historical data display in a table
      displayHistoricalData(financialData);
      console.log(financialData);

      //Basic chart display
      displayChart(financialData);

      //Forecast calculation
      const forecast = calculateForecast(financialData);
      console.log(forecast);

      //Forecast display
      displayForecast(financialData, forecast);

      //chart for forecast
      //displayForecastChart(financialData, forecast);
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function displayHistoricalData(data) {
  //Logic to create and include a table for historical data
  const tableContainer = document.getElementById("historical-data");

  const table = document.createElement("table");

  const headerRow = table.insertRow();
  for (const key in data[0]) {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  }

  // Rows for each data entry
  data.forEach((entry) => {
    const row = table.insertRow();
    for (const key in entry) {
      const cell = row.insertCell();
      cell.textContent = entry[key];
    }
  });

  // Append the table to the container
  tableContainer.appendChild(table);
}

function displayChart(financialData) {
  //Logic to generate and show a combined chart
  chartContainer = document.getElementById("chartContainer");
  const ctx = document.getElementById("myChart").getContext("2d");

  // Convert dates to a format compatible with Chart.js
  const formattedDates = financialData.map((entry) =>
    moment(entry.date).format("YYYY-MM-DD")
  );
  console.log(formattedDates);

  const chartData = {
    labels: financialData.map((entry) => entry.date), // Add a label for the forecast
    datasets: [
      {
        label: "Income",
        data: financialData.map((entry) => entry.income),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
        type: "line", // Use line type for income
      },
      {
        label: "Expenses",
        data: financialData.map((entry) => entry.expenses),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        type: "bar", // Use bar type for expenses
      },
    ],
  };

  myChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: {
      scales: {
        x: {
          //type: 'time',
          time: {
            unit: "day",
            tooltipFormat: "ll",
          },
          ticks: {
            source: "auto",
          },

          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Amount (in KES)",
          },
        },
      },
      elements: {
        line: {
          tension: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Historical Data Graph",
        },
      },
    },
  });
}

function calculateForecast(data) {
  const historicalData = data;

  // Extract x and y values for regression
  const xValues = historicalData.map((entry) => [entry.expenses, entry.date]);
  const yValues = historicalData.map((entry) => entry.income);

  // Perform linear regression
  const regressionResult = regression.linear(xValues, yValues);
  const slope = regressionResult.equation[0];
  const intercept = regressionResult.equation[1];

  // Generate forecast data for the next N months
  const forecastData = [];
  const numMonths = 4; // Change this to the desired number of months
  for (let i = 1; i <= numMonths; i++) {
    const nextMonthExpenses = 4500;

    const forecastedIncome =
      slope * nextMonthExpenses + intercept * (historicalData.length + i);

    //Ensure Income is not negative
    const finalForecastedIncome = Math.max(forecastedIncome, 0);


    //Push Forecast Data
    forecastData.push({
      date: historicalData.length + i,
      forecastedIncome: finalForecastedIncome, // Ensure income is not negative
    });
  }

  // Return forecast values
  return {
    slope,
    intercept,
    forecastData,
  };

  //Basic forecast logic(avg monthly income and expenses)
  /**
     * const totalIncome = data.reduce((acc, entry) => acc + entry.income, 0);
    const totalExpenses = data.reduce((acc, entry) => acc + entry.expenses, 0);
    const averageIncome = totalIncome / data.length;
    const averageExpenses = totalExpenses / data.length;

    return {
        averageIncome,
        averageExpenses
    };
     */
}

function displayForecast(historicalData, forecastData) {
  //Logic to generate and show a combined chart
  chartContainer = document.getElementById("chart2Container");
  const ctx = document.getElementById("my2Chart").getContext("2d");

  //Ensure forecastData is an array
  forecastData = Array.isArray(forecastData) ? forecastData : [];

  // Combine historical and forecast data for the chart
  const combinedData = [...historicalData, ...forecastData];
  //console.log(typeof forecastData);

  const chart2Data = {
    labels: combinedData.map((entry) => entry.date),
    datasets: [
      {
        label: "Actual Income",
        data: historicalData.map((entry) => entry.income),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Forecasted Income",
        data: forecastData.map((entry) => entry.forecastedIncome),
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  myChart = new Chart(ctx, {
    type: "line",
    data: chart2Data,
    options: {
      scales: {
        x:
          {
            ticks: {
                source: 'auto'
            },
            title: {
              display: true,
              text: "Month",
            },
          },
        
        y:
          {
         beginAtZero: true,   
            title: {
              display: true,
              text: "Income",
            },
          },
        
      },
      elements: {
        line: {
          tension: 0,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Graph of Forecast Data",
        },
      },
    },
  });
}

/**
 * //Forecast data display logic
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
 */
