// Function to create and display the statistics page
export function createStatPage(userData) {
    // Print the token to console
    console.log('token:');
    console.log(localStorage.getItem('jwToken'));

    // Creating the page DIV
    const page = document.createElement('div');
    page.id = 'statPage';

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

    // Creating 1 main DIV for user info
    const userInfo = createUserInfoDiv(userData);

    // Appending userInfo to the cross container
    crossContainer.appendChild(userInfo);

    // Appending header and cross container to the page
    page.appendChild(header);
    page.appendChild(crossContainer);

    // Adding contents to the body
    document.body.appendChild(page);

}


// Function to create userInfo div
function createUserInfoDiv(userData) {
    const userInfo = document.createElement('div');
    userInfo.id = 'userInfo';

    // Creating content elements
    const userLogin = document.createElement('h2');
    const userFirstName = document.createElement('span');
    const userLastName = document.createElement('span');
    const userPhone = document.createElement('span');
    const userMail = document.createElement('span');
    const userCountry = document.createElement('span');
    const userCity = document.createElement('span');
    const userAddr = document.createElement('span');

    // Filling with Data, ensuring correct fallback messages
    userLogin.innerText = 'User: ' + (userData.login || 'Login not available');
    userFirstName.innerText = 'First Name: ' + (userData.attrs.firstName || 'First name not available');
    userLastName.innerText = 'Last Name: ' + (userData.attrs.lastName || 'Last name not available');
    userPhone.innerText = 'Phone: ' + (userData.attrs.tel || 'Phone not available');
    userMail.innerText = 'E-mail: ' + (userData.attrs.email || 'E-mail not available');
    userCountry.innerText = 'Country: ' + (userData.attrs.addressCountry || 'Country not available');
    userCity.innerText = 'City: ' + (userData.attrs.addressCity || 'City not available');
    userAddr.innerText = 'Address: ' + (userData.attrs.addressStreet || 'Address not available');

    // Appending the elements to userInfo div
    userInfo.appendChild(userLogin);
    userInfo.appendChild(userFirstName);
    userInfo.appendChild(userLastName);
    userInfo.appendChild(userPhone);
    userInfo.appendChild(userMail);
    userInfo.appendChild(userCountry);
    userInfo.appendChild(userCity);
    userInfo.appendChild(userAddr);
    userInfo.appendChild(logoutButton);

    // Adding event listener for logoutButton click
    logoutButton.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('jwToken');
        location.reload();
    });

    return userInfo; // Return the complete userInfo div
}
