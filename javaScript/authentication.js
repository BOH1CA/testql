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

        // Check Content-Type to determine if the response is JSON
        const contentType = response.headers.get('Content-Type');
        let data;

        // Parse the response as JSON only if it's application/json
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            // If the content is not JSON, get it as text or other formats
            const textData = await response.text();
            try {
                data = JSON.parse(textData); // In case it is JSON as a string
            } catch {
                throw new Error('Unexpected response format from server');
            }
        }

        // Log the entire response data for debugging purposes
        console.log('Response from server:', data);

        // Store the JWT in localStorage (ensure it's in the expected property)
        if (data.token) {
            localStorage.setItem('jwToken', data.token); // Store token for later use
        } else {
            throw new Error('Token not found in response');
        }

        // Return user data (if needed)
        return data;
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



// Function to create loginForm
export function loginForm() {
    const form = document.createElement('form');
    const title = document.createElement('p');
    const inputUser = document.createElement('input');
    const inputPassword = document.createElement('input');
    const submitButton = document.createElement('button');

    form.id = 'loginForm';
    title.id = 'title';
    inputUser.id = 'username';
    inputPassword.id = 'password';

    inputUser.type = 'text';
    inputPassword.type = 'password';
    submitButton.type = 'submit';

    title.textContent = 'GraphQL';
    inputUser.placeholder = 'Username or Email';
    inputPassword.placeholder = 'Password';
    inputUser.required = true;
    inputPassword.required = true;
    submitButton.textContent = 'Login';

    // Append all elements in one call
    form.append(title, inputUser, inputPassword, submitButton);
    document.body.appendChild(form);

    // Event listener for form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = inputUser.value;
        const password = inputPassword.value;

        try {
            await loginRequest(username, password);
            alert("Login successful!");

            // Redirect to the desired page after successful login
            window.location.href = 'index.html'; // Change to your target page

        } catch (error) {
            alert(error.message); 
        }
    });
}