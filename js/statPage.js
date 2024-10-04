import { drawXPGraph } from './xpGraph.js';
import { mouseHover } from './xpGraph.js';
import { drawSkillCircle } from './skillCircle.js';

// Function to create and display the statistics page
export function createStatPage(userData) {

    // Print the token to console
    console.log('token:');
    console.log(localStorage.getItem('jwt'));

    // Creating the page DIV
    const page = document.createElement('div');
    page.id = 'statPage';

    // Creating a container for the cross layout
    const crossContainer = document.createElement('div');
    crossContainer.id = 'crossContainer';

    // Creating 4 main DIVs
    //#1
    const userInfo = document.createElement('div');
    userInfo.id = 'userInfo';
    //#2
    const xpInfo = document.createElement('div');
    xpInfo.id = 'xpInfo';
    //#3
    const skillsGraph = document.createElement('div');
    skillsGraph.id = 'skillsGraph';
    //#4
    const skillCircle = document.createElement('div');
    skillCircle.id = 'skillCircle';

    const skillBasicSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    skillBasicSVG.id = 'skillBasicSVG';
    skillCircle.appendChild(skillBasicSVG);

    // Creating DIV#1 content
    const userLogin = document.createElement('h2');
    const userFirstName = document.createElement('span');
    const userLastName = document.createElement('span');
    const userPhone = document.createElement('span');
    const userMail = document.createElement('span');
    const userCountry = document.createElement('span');
    const userCity = document.createElement('span');
    const userAddr = document.createElement('span');
    // Filling with Data
    userLogin.innerText = 'User: ' + userData.login || 'Login not available';
    userFirstName.innerText = userData.attrs.firstName || 'First name not available';
    userLastName.innerText = userData.attrs.lastName || 'Last name not available';
    userPhone.innerText = userData.attrs.tel || 'Phone not available';
    userMail.innerText = userData.attrs.email || 'E-mail not available';
    userCountry.innerText = userData.attrs.addressCountry || 'Country not available';
    userCity.innerText = userData.attrs.addressCity || 'Phone not available';
    userAddr.innerText = userData.attrs.addressStreet || 'E-mail not available';
    // Adding LogOut button
    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.textContent = 'Log out';
    // Appending the elements to DIV#1
    userInfo.appendChild(userLogin);
    userInfo.appendChild(userFirstName);
    userInfo.appendChild(userLastName);
    userInfo.appendChild(userPhone);
    userInfo.appendChild(userMail);
    userInfo.appendChild(userCountry);
    userInfo.appendChild(userCity);
    userInfo.appendChild(userAddr);
    userInfo.appendChild(logoutButton);

    // Creating DIV#2 content
    const userXP = document.createElement('h2');
    const userAuditPassed = document.createElement('span');
    const userAuditRatio = document.createElement('h2');
    const userAuditsNumber = document.createElement('span');
    // Filling with Data
    userXP.innerText = 'XP: ' + xpCalc(userData) || 'XP not available';
    userAuditPassed.innerText = 'Audits passed: ' + Math.round(userData.audits_aggregate.aggregate.count / userData.auditRatio) || 'Audits passed number not available';
    userAuditRatio.innerText = 'Audit ratio: ' + userData.auditRatio.toFixed(2) || 'Audit ratio not available';
    userAuditsNumber.innerText = 'Audits number: ' + userData.audits_aggregate.aggregate.count || 'Audits number not available';
    // Appending the elements to DIV#2
    xpInfo.appendChild(userXP);
    xpInfo.appendChild(userAuditPassed);
    xpInfo.appendChild(userAuditRatio);
    xpInfo.appendChild(userAuditsNumber);

    // Appending the elements to the cross container
    crossContainer.appendChild(userInfo);
    crossContainer.appendChild(xpInfo);
    crossContainer.appendChild(skillsGraph);
    crossContainer.appendChild(skillCircle);

    // Appending the cross container to the page
    page.appendChild(crossContainer);

    // Adding contents to the body
    document.body.appendChild(page);

    // Drawing the skill graph inside the skillsGraph div
    drawXPGraph(userData, 'skillsGraph');

    // Drawing the skill circle #1 inside the skillCircle div
    drawSkillCircle(userData, 'skillBasicSVG');

    // Adding event listener for logoutButton click
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('jwt');
        location.reload();
    });

    const container = document.getElementById('skillsGraph');

    container.addEventListener('mouseover', () => {
        mouseHover(true);
    });

    container.addEventListener('mouseout', () => {
        mouseHover(false);
    });
}

// Helper function for calculating total amount of XP
function xpCalc (userData) {
    let xpSum = 0;
    if (userData) {
        userData.xps.forEach(xp => {
            xpSum += xp.amount;
        });
    }
    return xpSum;
}