// Function to handle the login request
const loginRequest = async (username, password) => {
    // Encode username and password in base64 for Basic Authentication
    const encodeInfo = btoa(`${username}:${password}`);

    try {
        // Send POST request for user authentication
        const response = await fetch('https://01.kood.tech/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${encodeInfo}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error('Sign in Failed');
        }

        // Assuming the response contains a JSON object with the token
        const jsonResponse = await response.json();
        
        // Extract the token from the JSON response
        const token = jsonResponse.token || jsonResponse.jwt || ''; // Adjust based on API response

        // Log the token for debugging purposes
        console.log('Parsed response token:', token);

        // Store the JWT in localStorage
        if (token) {
            localStorage.setItem('jwToken', token); // Store token for later use
        } else {
            throw new Error('Token not found in response');
        }

        // Return the token if needed (optional)
        return token;
    } catch (error) {
        // Handle specific errors based on the message
        if (error.message === 'Sign in Failed') {
            throw new Error('Invalid credentials'); // Handle invalid credentials
        } else {
            console.error('Error during login:', error);
            throw new Error('Server error. Please try again later.'); // Handle other errors
        }
    }
};

// Function to create and handle the login form
export function createLoginForm() {
    // Creating the form elements
    const form = document.createElement('form');
    form.id = 'loginForm';

    const loginTitle = document.createElement('p');
    loginTitle.id = 'login-title';
    loginTitle.textContent = 'GraphQL: login';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.id = 'username';
    usernameInput.placeholder = 'Username or Email';
    usernameInput.required = true;

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.id = 'password';
    passwordInput.placeholder = 'Password';
    passwordInput.required = true;

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.textContent = 'Login';

    // Appending the elements to the form
    form.append(loginTitle, usernameInput, passwordInput, loginButton);
    document.body.appendChild(form);

    // Adding event listener for form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        try {
            // Perform login request and store token if successful
            const token = await loginRequest(username, password);

            if (token) {
                alert("Login successful!");

                // Ensure token is set in localStorage before redirecting
                if (localStorage.getItem('jwToken')) {
                    // Redirect to the desired page after successful login
                    location.assign('index.html'); // Use assign for safer redirect
                } else {
                    throw new Error("Token not found. Please try logging in again.");
                }
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

