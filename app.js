import http from 'http';
import url from 'url'

import { getEquations } from './math-utils.js';

// HTTP Port
const PORT = 8080;

// Function to generate HTML content for a specific equation and timer
// Equation: math ML block for the equation
// solution : unorderd list of MathML base solutions
// nextPageIndex: next index to use, for the html link (randomly generated)
function generateHTMLContent(equation, solutions, nextPageindex) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Equations</title>
      <script>
        // Timer logic
        let elapsedTime = 0;

        function updateTimer() {
          elapsedTime++;
          document.getElementById("timer").innerText = "Elapsed Time: " + elapsedTime + " seconds";
        }

        function revealSolution() {
          document.getElementById("hiddenText").style.display = "block";
        }

        setInterval(updateTimer, 1000);
      </script>
    </head>
    <body>
      <h1>Factorize this:</h1>
      <div id="equation">
        <h2>${equation}</h2>
      </div>
      <p>Solution(s) :</p>
      <div id="hiddenText" style="display: none;">${solutions}</div>
      <br/>
      <button id="revealTextButton" onclick="revealSolution()">Show Solution</button>
      <a href="/?index=${nextPageindex}">Next Equation</a>
      <h3 id="timer"/>

    </body>
    </html>
  `;
}


const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  let q = url.parse(req.url, true).query;

  let index = q.index;
  if (index != undefined) {
    try {
      const equations = getEquations();
      const iterator = equations[Symbol.iterator]();

      if (index < equations.size) {
        // Quick and dirty way to find the nth equation by calling iterator.next()
        let currentEquation;
        for (let i = 0; i <= index; i++) {
          currentEquation = iterator.next();
        }

        //console.debug(`currentEquation.value[0]= ${currentEquation.value[0]} `)
        //console.debug(`currentEquation.value[1]= ${currentEquation.value[1]} `)

        // Generate HTML content for the solutions to the current equation
        let solutions = '<ul>'
        currentEquation.value[1].forEach((solution) => solutions += `<li>${solution}</li>`);
        solutions += '</ul>'
        let nextPageindex = Math.floor(Math.random() * equations.size);
        //console.debug(`solutions= ${solutions} `)

        // Generate the HTML content and send it as a response.
        const htmlContent = generateHTMLContent(currentEquation.value[0], solutions, nextPageindex);
        res.end(htmlContent);
      } else {
        res.end("<h1>No more equations to display.</h1>");
      }
    } catch (error) {
      res.statusCode = 500;
      res.end("Error generating page.");
      console.error(error)
    }
  } else {
    res.statusCode = 400;
    res.end(`index parameter not provided e.g. http://localhost:${PORT}/?index=0`);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/?index=0`);
});
