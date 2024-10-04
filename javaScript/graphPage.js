// Function to create and display the statistics page
export function displayStats(userData, transactionsData, xpProgressData) {
    // Print the token to console
    console.log('token:');
    console.log(localStorage.getItem('jwToken'));

    // Creating the page DIV
    const page = document.createElement('div');
    page.id = 'graphPage';

    // Creating the header container
    const header = document.createElement('div');
    header.id = 'header';

    // Left side - GraphQL text
    const graphqlText = document.createElement('h2');
    graphqlText.innerText = 'GraphQL';
    header.appendChild(graphqlText);

    // Right side - Logout button
    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.textContent = 'Log out';

    // Adding logout functionality
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('jwToken');
        location.reload();
    });

    // Appending the logout button to the header
    header.appendChild(logoutButton);

    // Creating a container for the cross layout
    const crossContainer = document.createElement('div');
    crossContainer.id = 'crossContainer';

    // Creating userInfo DIV by calling createUserInfoDiv function
    const userInfo = createUserInfoDiv(userData);

    // Creating auditRatio DIV with a pie chart
    const auditRatioDiv = createAuditRatioDiv(userData, transactionsData);

    // Appending userInfo and auditRatioDiv to the cross container
    crossContainer.appendChild(userInfo);
    crossContainer.appendChild(auditRatioDiv);

    // Appending header and cross container to the page
    page.appendChild(header);
    page.appendChild(crossContainer);

    // Adding contents to the body
    document.body.appendChild(page);
}

// Function to create the user info div
export function createUserInfoDiv(userData) {
    // Creating userInfo div
    const userInfo = document.createElement('div');
    userInfo.id = 'userInfo';

    // Creating elements for user information
    const userLogin = document.createElement('h2');
    userLogin.innerText = 'User: ' + (userData.login || 'Login not available');

    // Appending user information to userInfo div
    userInfo.appendChild(userLogin);

    return userInfo;
}

// Function to create the audit ratio div with a pie chart
export function createAuditRatioDiv(userData, transactionsData) {
    // Creating auditRatio div
    const auditRatioDiv = document.createElement('div');
    auditRatioDiv.id = 'auditRatioDiv';

    // Creating a heading for the audit ratio
    const auditRatioHeading = document.createElement('h2');
    auditRatioHeading.innerText = 'Audit Ratio: ' + userData.auditRatio.toFixed(2);

    // Creating paragraphs for Received XP and Given XP
    const receivedXP = document.createElement('p');
    const givenXP = document.createElement('p');

    // Calculate Received XP and Given XP from transactionsData
    const receivedXPValue = transactionsData.filter(tx => tx.type === 'xp' && tx.amount > 0)
                                             .reduce((acc, tx) => acc + tx.amount, 0);
    const givenXPValue = transactionsData.filter(tx => tx.type === 'xp' && tx.amount < 0)
                                         .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

    receivedXP.innerText = 'Received XP: ' + receivedXPValue;
    givenXP.innerText = 'Given XP: ' + givenXPValue;

    // Creating a div for the pie chart
    const pieChartDiv = document.createElement('div');
    pieChartDiv.id = 'pieChartDiv';

    // Calling function to render the pie chart inside pieChartDiv
    renderPieChart(userData, pieChartDiv);

    // Appending the heading, XP values, and pie chart to auditRatioDiv
    auditRatioDiv.appendChild(auditRatioHeading);
    auditRatioDiv.appendChild(receivedXP);
    auditRatioDiv.appendChild(givenXP);
    auditRatioDiv.appendChild(pieChartDiv);

    return auditRatioDiv;
}

// Function to render the pie chart
export function renderPieChart(userData, pieChartDiv) {
    const svgNS = "http://www.w3.org/2000/svg";
    const pieChartSVG = document.createElementNS(svgNS, 'svg');
    pieChartSVG.setAttribute('width', '200');
    pieChartSVG.setAttribute('height', '200');

    // Assuming you have a ratio value between 0 and 1, calculate angles
    const passedRatio = userData.auditRatio || 0; // Example ratio
    const remainingRatio = 1 - passedRatio;

    // Calculate angles for the pie chart
    const passedAngle = passedRatio * 360;
    const remainingAngle = remainingRatio * 360;

    // Create paths for passed audits and remaining audits
    const passedPath = createPiePath(passedAngle, 100, 100, 100, svgNS, '#4caf50');
    const remainingPath = createPiePath(remainingAngle, 100, 100, 100, svgNS, '#f44336');

    // Append paths to the SVG
    pieChartSVG.appendChild(passedPath);
    pieChartSVG.appendChild(remainingPath);

    // Append SVG to the pieChartDiv
    pieChartDiv.appendChild(pieChartSVG);
}

// Helper function to create SVG path for pie chart
function createPiePath(angle, cx, cy, radius, svgNS, color) {
    const largeArcFlag = angle > 180 ? 1 : 0;
    const x = cx + radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = cy + radius * Math.sin((angle - 90) * (Math.PI / 180));

    const path = document.createElementNS(svgNS, 'path');
    const d = `M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x} ${y} Z`;
    path.setAttribute('d', d);
    path.setAttribute('fill', color);

    return path;
}






