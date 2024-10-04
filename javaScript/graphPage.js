// Function to create and display the statistics page
export function displayStats(userData) {
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
    const auditRatioDiv = createAuditRatioDiv(userData);

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
    const userFirstName = document.createElement('span');
    const userLastName = document.createElement('span');
    const userPhone = document.createElement('span');
    const userMail = document.createElement('span');
    const userCountry = document.createElement('span');
    const userCity = document.createElement('span');
    const userAddr = document.createElement('span');

    // Filling with data from userData
    userLogin.innerText = 'User: ' + (userData.login || 'Login not available');
    userFirstName.innerText = 'First name: ' + (userData.attrs.firstName || 'First name not available');
    userLastName.innerText = 'Last name: ' + (userData.attrs.lastName || 'Last name not available');
    userPhone.innerText = 'Phone: ' + (userData.attrs.tel || 'Phone not available');
    userMail.innerText = 'E-mail: ' + (userData.attrs.email || 'E-mail not available');
    userCountry.innerText = 'Country: ' + (userData.attrs.addressCountry || 'Country not available');
    userCity.innerText = 'City: ' + (userData.attrs.addressCity || 'City not available');
    userAddr.innerText = 'Address: ' + (userData.attrs.addressStreet || 'Address not available');

    // Appending all elements to userInfo div
    userInfo.appendChild(userLogin);
    userInfo.appendChild(userFirstName);
    userInfo.appendChild(userLastName);
    userInfo.appendChild(userPhone);
    userInfo.appendChild(userMail);
    userInfo.appendChild(userCountry);
    userInfo.appendChild(userCity);
    userInfo.appendChild(userAddr);

    return userInfo;
}

// Function to create the audit ratio div with a donut chart and XP amounts
export function createAuditRatioDiv(userData) {
    // Creating auditRatio div
    const auditRatioDiv = document.createElement('div');
    auditRatioDiv.id = 'auditRatioDiv';

    // Creating a heading for the audit ratio
    const auditRatioHeading = document.createElement('h2');
    auditRatioHeading.innerText = 'Audits Chart';

    // Creating a div for the donut chart
    const pieChartDiv = document.createElement('div');
    pieChartDiv.id = 'pieChartDiv';

    // Calling function to render the donut chart inside pieChartDiv
    renderDonutChart(userData, pieChartDiv);

    // Creating a div for XP amounts
    const xpInfoDiv = document.createElement('div');
    xpInfoDiv.id = 'xpInfoDiv';
    const receivedXP = document.createElement('p');
    const doneXP = document.createElement('p');
    receivedXP.innerText = `Received audit XP: ${userData.receivedAuditXP.toFixed(2)} MiB`;
    doneXP.innerText = `Done audit XP: ${userData.doneAuditXP.toFixed(2)} MiB`;

    xpInfoDiv.appendChild(receivedXP);
    xpInfoDiv.appendChild(doneXP);

    // Appending the heading, the pie chart, and the XP amounts to auditRatioDiv
    auditRatioDiv.appendChild(auditRatioHeading);
    auditRatioDiv.appendChild(pieChartDiv);
    auditRatioDiv.appendChild(xpInfoDiv);

    return auditRatioDiv;
}

// Function to render the donut chart
export function renderDonutChart(userData, pieChartDiv) {
    const svgNS = "http://www.w3.org/2000/svg";
    const donutChartSVG = document.createElementNS(svgNS, 'svg');
    donutChartSVG.setAttribute('width', '200');
    donutChartSVG.setAttribute('height', '200');
    donutChartSVG.setAttribute('viewBox', '0 0 200 200');

    const totalXP = userData.receivedAuditXP + userData.doneAuditXP;
    const receivedRatio = userData.receivedAuditXP / totalXP;
    const doneRatio = 1 - receivedRatio; // Complementary ratio

    // Create paths for received and done audits
    const receivedPath = createDonutPath(receivedRatio, 100, 100, 90, 60, svgNS, '#ba68c8', true);
    const donePath = createDonutPath(doneRatio, 100, 100, 90, 60, svgNS, '#42a5f5', false);

    // Append paths to the SVG
    donutChartSVG.appendChild(receivedPath);
    donutChartSVG.appendChild(donePath);

    // Append SVG to the pieChartDiv
    pieChartDiv.appendChild(donutChartSVG);
}

// Helper function to create SVG path for donut chart
function createDonutPath(ratio, cx, cy, outerRadius, innerRadius, svgNS, color, isFirstSegment) {
    const angle = ratio * 2 * Math.PI;  // Full circle in radians
    const largeArcFlag = ratio > 0.5 ? 1 : 0;

    // Coordinates for the outer arc
    const x1 = cx + outerRadius * Math.cos(-Math.PI / 2);
    const y1 = cy + outerRadius * Math.sin(-Math.PI / 2);
    const x2 = cx + outerRadius * Math.cos(angle - Math.PI / 2);
    const y2 = cy + outerRadius * Math.sin(angle - Math.PI / 2);

    // Coordinates for the inner arc
    const x3 = cx + innerRadius * Math.cos(angle - Math.PI / 2);
    const y3 = cy + innerRadius * Math.sin(angle - Math.PI / 2);
    const x4 = cx + innerRadius * Math.cos(-Math.PI / 2);
    const y4 = cy + innerRadius * Math.sin(-Math.PI / 2);

    // Create the path using arc commands
    const path = document.createElementNS(svgNS, 'path');
    const outerArc = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    const lineToInner = `L ${x3} ${y3}`;
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`;
    const closePath = 'Z';

    // Combine the parts of the path into the 'd' attribute
    const d = `${outerArc} ${lineToInner} ${innerArc} ${closePath}`;
    path.setAttribute('d', d);
    path.setAttribute('fill', color);

    return path;
}

