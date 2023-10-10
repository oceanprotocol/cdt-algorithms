const fs = require('fs');
const puppeteer = require('puppeteer');

function getFilename() {
    let dids = process.env.DIDS

    if (!dids) {
        console.log("No DIDs found in environment. Aborting.")
        return
    }

    dids = JSON.parse(dids)

    for (let did in dids) {
        let filename = `data/inputs/${did}/0`;
        console.log(`Reading asset file ${filename}.`);

        return filename;
    }
}

function extractResults(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the file:', err);
        return reject(err);
      }

      try {
        const jsonData = JSON.parse(data);
        const resultsArray = jsonData.results;

        resolve(resultsArray);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        reject(parseError);
      }
    });
  });
}

  

function getTop10ClosingPrices(results) {
    return results
    .map((result) => ({
        symbol: result.T,
        price: result.c
    }))
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);
}

function getTop10TradingVolumes(results, best=true) {
    if (best === true) {
        return results
        .map((result) => ({
            symbol: result.T,
            volume: result.v
        }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 10);
    } else {
        return results
        .map((result) => ({
            symbol: result.T,
            volume: result.v
        }))
        .sort((a, b) => a.volume - b.volume)
        .slice(0, 10);
    }
}

let top10ClosingPricesExported = null;
let top10BestTradingVolumesExported = null;
let top10WorstTradingVolumesExported = null;
extractResults('input.json')
  .then((results) => {
    const top10ClosingPrices = getTop10ClosingPrices(results);
    top10ClosingPricesExported = top10ClosingPrices;
    const top10BestTradingVolumes = getTop10TradingVolumes(results);
    top10BestTradingVolumesExported = top10BestTradingVolumes;
    const top10WorstTradingVolumes = getTop10TradingVolumes(results, best=false);
    top10WorstTradingVolumesExported = top10WorstTradingVolumes;
  })
  .catch((error) => {
    console.error('Error when extracting the results: ', error);
  });
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load an HTML file or content
    await page.setContent(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Finance Report</title>
            <!-- Include Chart.js from a CDN or your local path -->
            <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
            <style>
            body {
                text-align: center;
            }

            h1 {
                font-family: 'Courier-Bold', monospace;
                color: #444444;
                font-size: 20px;
            }
            h2 {
                font-family: 'Courier-Bold', monospace;
                color: #444444;
                font-size: 20px;
                text-align: left
            }
            hr {
                border: 1px solid #aaaaaa;
                margin: 20px auto;
                width: 80%;
            }
            table {
                width: 50%;
                border-collapse: collapse;
                margin: 20px auto;
            }

            th {
                background-color: #333;
                color: white;
                padding: 10px;
            }
    
            tr {
                border-bottom: 1px solid #ddd;
            }
    
            td {
                font-family: 'Courier-Bold', monospace;
                color: #444444;
                padding: 10px;
                text-align: center;
            }
        </style>
        </head>
        <body>
            <h1>Finance Report</h1>
            <hr>
            <h2>Top 10 Closing Prices</h2>
            <canvas id="report-chart" width="400" height="200"></canvas>
            <script>
                const ctx = document.getElementById('report-chart').getContext('2d');
                const data = {
                    labels: ${JSON.stringify(top10ClosingPricesExported.map((closingPrice) => closingPrice.symbol))},
                    datasets: [{
                        label: 'Value',
                        data: ${JSON.stringify(top10ClosingPricesExported.map((closingPrice) => closingPrice.price))},
                        backgroundColor: 'rgba(75, 190, 190, 0.9)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                };
                const config = {
                    type: 'bar',
                    data: data,
                    options: {
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: 1400
                            }
                        }
                    }
                };
                new Chart(ctx, config);
            </script>
            <br/><br/>
            <h2>Top 10 Best Trading Volumes</h2>
            <script>
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const headers = ['Symbol', 'Best Trading Volume']

                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                const tableData = ${JSON.stringify(top10BestTradingVolumesExported)}
                tableData.forEach(item => {
                    const row = document.createElement('tr');
                    Object.values(item).forEach(value => {
                        const cell = document.createElement('td');
                        cell.textContent = value;
                        row.appendChild(cell);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                document.body.appendChild(table);
            </script>
            <br/><br/>
            <h2>Top 10 Worst Trading Volumes</h2>
            <script>
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                const headers = ['Symbol', 'Worst Trading Volume']

                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });

                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                const tableData = ${JSON.stringify(top10WorstTradingVolumesExported)}
                tableData.forEach(item => {
                    const row = document.createElement('tr');
                    Object.values(item).forEach(value => {
                        const cell = document.createElement('td');
                        cell.textContent = value;
                        row.appendChild(cell);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);
                document.body.appendChild(table);
            </script>
        </body>
        </html>
    `);

    // Wait for any asynchronous rendering to complete (e.g., Chart.js rendering)
    await page.waitForTimeout(2000); // Adjust the timeout as needed

    // Generate a PDF
    await page.pdf({ path: 'report.pdf', format: 'A4' });

    await browser.close();
})();