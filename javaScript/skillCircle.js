// Main function to draw the skill radar charts
export async function drawSkillCircle(userData, targetElementId) {
    
    const filters = [
        { type: 'skill_algo' },
        { type: 'skill_front-end' },
        { type: 'skill_back-end' },
        { type: 'skill_stats' },
        { type: 'skill_ai' },
        { type: 'skill_game' }
    ];

    const techSkills = filterSkills(userData.transactions, filters, true);
    const otherSkills = filterSkills(userData.transactions, filters, false);

    console.log();(techSkills);
    console.log();(otherSkills);

    const colors = [
        '#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0',
        '#ffb3e6', '#c4e17f', '#76d7c4', '#f7b1ab', '#dab6e1', '#cbbeb5'
    ];

    drawSkillChart(`${targetElementId}`, techSkills, colors);

}


function drawSkillChart(svgId, chartData, colors) {

    const svg = document.getElementById(svgId);

    if (!svg) return;

    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    const angleIncrement = 360 / chartData.length;

    svg.innerHTML = ''; // Clear previous contents

    // Set the viewBox attribute for responsiveness
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Create document fragment for batch DOM updates
    const fragment = document.createDocumentFragment();

    // Draw the 100% radius circle
    const outerCircle = createSVGElement('circle', {
        cx: centerX,
        cy: centerY,
        r: radius,
        fill: 'none',
        stroke: '#cccccc',
        'stroke-width': 2
    });
    fragment.appendChild(outerCircle);

    // Calculate points for each skill
    const skillPoints = chartData.map((item, index) => {
        const percentage = item.amount / 100;
        const skillRadius = percentage * radius;
        const angle = angleIncrement * index - 90;
        const skillX = centerX + skillRadius * Math.cos(angle * Math.PI / 180);
        const skillY = centerY + skillRadius * Math.sin(angle * Math.PI / 180);
        const fullX = centerX + radius * Math.cos(angle * Math.PI / 180);
        const fullY = centerY + radius * Math.sin(angle * Math.PI / 180);
        return { skillX, skillY, fullX, fullY, color: colors[index % colors.length], type: item.type };
    });

    // Draw the polygon connecting actual skill points
    const pathData = "M" + skillPoints.map(p => `${p.skillX},${p.skillY}`).join(" L ") + " Z";
    const path = createSVGElement('path', {
        d: pathData,
        fill: 'none',
        stroke: 'black',
        'stroke-width': 2
    });
    fragment.appendChild(path);

    // Draw the radius lines, points, and legends
    skillPoints.forEach(point => {
        const line = createSVGElement('line', {
            x1: centerX,
            y1: centerY,
            x2: point.fullX,
            y2: point.fullY,
            stroke: point.color,
            'stroke-width': 2
        });
        fragment.appendChild(line);

        const circle = createSVGElement('circle', {
            cx: point.skillX,
            cy: point.skillY,
            r: 5,
            fill: point.color
        });

        fragment.appendChild(circle);

        const text = createSVGElement('text', {
            x: point.fullX,
            y: point.fullY,
            fill: 'black',
            'font-size': 16,
            'text-anchor': 'middle'
        });

        let tempText = point.type;
        tempText = tempText.substring(6).trimStart();
        text.textContent = tempText.toUpperCase();
        fragment.appendChild(text);

    });

    svg.appendChild(fragment);

}

// Helper function to create SVG elements
function createSVGElement(tag, attributes) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const attr in attributes) {
        if (attributes.hasOwnProperty(attr)) {
            element.setAttribute(attr, attributes[attr]);
        }
    }
    return element;
}

// Filter skills based on the given filters
function filterSkills(transactions, filters, include) {

    return transactions.filter(item => {

        const matches = filters.some(filter => filter.type === item.type);

        return include ? matches : !matches;

    });

}