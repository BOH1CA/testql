// Drawing learning progression graph
export async function drawXPGraph(userData, targetElementId) {

    const progressMap = new Map(userData.progresses.map(item => [item.path, item.createdAt]));

    userData.xps.forEach(xp => {
        if (progressMap.has(xp.path)) {
            xp.createdAt = progressMap.get(xp.path);
        }
    });

    const margin = { top: 20, right: 30, bottom: 50, left: 60 },
        width = 1920 - margin.left - margin.right,
        height = 1080 - margin.top - margin.bottom;

    d3.select(`#${targetElementId} svg`).remove();

    const svg = d3.select(`#${targetElementId}`)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("class", "stats-svg")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const parseTime = d3.timeParse("%Y-%m-%d");

    userData.xps.forEach(d => {
        d.createdAt = parseTime(d.createdAt.split('T')[0]);
        d.projectName = dateFormatter(d.createdAt) + ': ' + (d.path.split('/').pop());

    });

    userData.xps.sort((a, b) => a.createdAt - b.createdAt);

    userData.xps.reduce((acc, d) => {
        d.cumulativeAmount = acc + d.amount / 1000;
        return d.cumulativeAmount;
    }, 0);

    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    const valueline = d3.line()
        .x(d => x(d.createdAt))
        .y(d => y(d.cumulativeAmount));

    x.domain(d3.extent(userData.xps, d => d.createdAt));
    y.domain([0, d3.max(userData.xps, d => d.cumulativeAmount)]);

    svg.append("path")
        .data([userData.xps])
        .attr("class", "line")
        .attr("d", valueline)

    svg.selectAll("circle.dot")
        .data(userData.xps)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.createdAt))
        .attr("cy", d => y(d.cumulativeAmount))

    svg.selectAll("text.label")
        .data(userData.xps)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => x(d.createdAt) + 5)
        .attr("y", d => y(d.cumulativeAmount) - 5)
        .text(d => d.projectName)

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .call(d3.axisLeft(y));
}


export function mouseHover(switchOn) {
    // Smooth movement part
    const speedFactor = 0.1;
    let scale = 1;

    if (switchOn) {
        scale = 3;
    } else {
        scale = 1;
    }

    const skillsGraph = document.getElementById('skillsGraph');
    const svg = d3.select('#skillsGraph .stats-svg');

    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let targetOffsetX = 0;
    let targetOffsetY = 0;

    // Helper function to update the SVG transform smoothly
    function updateTransform() {
        currentOffsetX += (targetOffsetX - currentOffsetX) * speedFactor;
        currentOffsetY += (targetOffsetY - currentOffsetY) * speedFactor;

        svg.style('transform', `scale(${scale}) translate(${-currentOffsetX}px, ${-currentOffsetY}px)`);

        requestAnimationFrame(updateTransform);
    }

    // Start the animation loop
    requestAnimationFrame(updateTransform);

    // Scaling part
    // Add event listeners to the parent div for mouse movement
    skillsGraph.addEventListener('mousemove', (event) => {
        const rect = skillsGraph.getBoundingClientRect();
        const x = event.clientX - rect.left; // x position within the element
        const y = event.clientY - rect.top;  // y position within the element

        // Calculate the percentage position within the element
        const xPercent = x / rect.width;
        const yPercent = y / rect.height;

        // Calculate target offsets
        targetOffsetX = ((xPercent - 0.5) * (scale - 1) * rect.width);
        targetOffsetY = ((yPercent - 0.5) * (scale - 1) * rect.height);
    });

}

function dateFormatter(dateString) {

    // Create a Date object
    const date = new Date(dateString);

    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    // Format the date to "23 Oct 2023"
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;

}