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

// Function to create the audit ratio div with a pie chart
export function createAuditRatioDiv(userData) {
    // Creating auditRatio div
    const auditRatioDiv = document.createElement('div');
    auditRatioDiv.id = 'auditRatioDiv';

    // Creating a heading for the audit ratio
    const auditRatioHeading = document.createElement('h2');
    auditRatioHeading.innerText = 'Audit Ratio: ' + userData.auditRatio.toFixed(2);

    // Creating a div for the pie chart
    const pieChartDiv = document.createElement('div');
    pieChartDiv.id = 'pieChartDiv';

    // Calling the new renderAuditRatioChart function to render the pie chart
    renderAuditRatioChart(userData.auditDone, userData.auditReceived);

    // Appending the heading and the pie chart to auditRatioDiv
    auditRatioDiv.appendChild(auditRatioHeading);
    auditRatioDiv.appendChild(pieChartDiv);

    return auditRatioDiv;
}


// Function to render the audit ratio pie chart
export function renderAuditRatioChart(auditDone, auditReceived) {
    const data = [
        { name: "Audits Done", value: auditDone }, 
        { name: "Audits Received", value: auditReceived }
    ];
    const width = 450, height = 350, margin = 40;
    const radius = Math.min(width, height) / 2 - margin;

    const chartContainer = d3.select("#auditRatioContainer");
    chartContainer.html(''); // Clear the container if there's any previous chart

    chartContainer.append("div")
        .attr("class", "chart-title")
        .text("Audit Ratio Chart");

    const xpInfo = chartContainer.append("div")
        .attr("class", "xp-info");

    xpInfo.append("p").text("Received audit XP: " + formatXP(auditReceived, 2));
    xpInfo.append("p").text("Done audit XP: " + formatXP(auditDone, 2));

    const svg = chartContainer.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(["#ffa4d9", "#98caff"]); // Different colors for Done and Received

    const pie = d3.pie()
        .value(d => d.value);

    const arc = d3.arc()
        .innerRadius(radius * 0.5)  // Donut chart with inner radius
        .outerRadius(radius * 0.8);

    const arcHover = d3.arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.9);  // Bigger outer radius on hover

    const slices = svg.selectAll("path")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.7);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    slices.on("mouseover", (event, d) => {
        const [centroidX, centroidY] = arc.centroid(d);
        const svgRect = svg.node().getBoundingClientRect();

        const centroidAbsX = svgRect.left + window.scrollX + centroidX;
        const centroidAbsY = svgRect.top + window.scrollY + centroidY;
        const isLeftSide = centroidX < 0;

        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip.html(d.data.name + ": " + formatXP(d.data.value, 2));

        let leftPos = centroidAbsX + (isLeftSide ? -tooltip.node().offsetWidth - -160 : 20);
        tooltip.style("left", leftPos + "px");

        let topPos = centroidAbsY - tooltip.node().offsetHeight / 2;
        tooltip.style("top", topPos + "px");

        d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr("d", arcHover);
    })
        .on("mouseout", (event, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);

            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr("d", arc);
        });
}

// Utility function to format XP as in the original
export function formatXP(bits, decimals = 2) {
    if (!+bits) return '0 Bits';

    const bit = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bits', 'KiB', 'MiB', 'GiB'];
    const i = Math.floor(Math.log(bits) / Math.log(bit));
    return `${parseFloat((bits / Math.pow(bit, i)).toFixed(dm))} ${sizes[i]}`;
}
