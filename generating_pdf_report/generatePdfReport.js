const fs = require('fs');
const puppeteer = require('puppeteer');

function getFilename() {
    let dids = process.env.DIDS

    if (!dids) {
        console.log("No DIDs found in environment. Aborting.")
        return
    }

    dids = JSON.parse(dids)

    for (const did of dids) {
        const filename = `data/inputs/${did}/0`;
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

const filename = getFilename();
extractResults(filename)
  .then((results) => {
    const top10ClosingPrices = getTop10ClosingPrices(results);
    top10ClosingPricesExported = top10ClosingPrices;
    const top10BestTradingVolumes = getTop10TradingVolumes(results);
    top10BestTradingVolumesExported = top10BestTradingVolumes;
    const top10WorstTradingVolumes = getTop10TradingVolumes(results, false);
    top10WorstTradingVolumesExported = top10WorstTradingVolumes;
  })
  .catch((error) => {
    console.error('Error when extracting the results: ', error);
  });
  (async () => {    
    const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    console.log('executable path: ', executablePath);
    const browser = await puppeteer.launch({
        executablePath: `${executablePath}`,
        args: [ '--disable-gpu', '--disable-setuid-sandbox', '--no-sandbox', '--no-zygote' ],
        headless: true 
    });
    const page = await browser.newPage();

    console.log('top10ClosingPricesExported: ', top10ClosingPricesExported)

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
                font-family: 'Courier-Bold', monospace;
                background-color: #333;
                color: white;
                padding: 10px;
            }
    
            tr {
                font-family: 'Courier-Bold', monospace;
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
            const table2 = document.createElement('table');
            const thead2 = document.createElement('thead');
            const headerRow2 = document.createElement('tr');
            const headers2 = ['Symbol', 'Worst Trading Volume'];

            headers2.forEach(headerText => {
                const th2 = document.createElement('th');
                th2.textContent = headerText;
                headerRow2.appendChild(th2);
            });

            thead2.appendChild(headerRow2);
            table2.appendChild(thead2);

            const tbody2 = document.createElement('tbody');
            const tableData2 = ${JSON.stringify(top10WorstTradingVolumesExported)};
            tableData2.forEach(item => {
                const row2 = document.createElement('tr');
                Object.values(item).forEach(value => {
                    const cell2 = document.createElement('td');
                    cell2.textContent = value === 0 ? '0' : value;
                    row2.appendChild(cell2);
                });
                tbody2.appendChild(row2);
            });
            table2.appendChild(tbody2);
            document.body.appendChild(table2);
        </script>
        </body>
        </html>
    `);

    await page.waitForSelector('#report-chart');

    // Generate a PDF
    await page.pdf({ path: 'report.pdf', format: 'A4' });

    await browser.close();
})();