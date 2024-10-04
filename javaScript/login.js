// Function to create and display the login form
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

    const authorButton = document.createElement('button');
    authorButton.type = 'button';
    authorButton.textContent = 'Author stats: Alex Dubtsov';

    // Appending the elements to the form
    form.appendChild(loginTitle);
    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    form.appendChild(loginButton);
    form.appendChild(authorButton);

    // Adding form to the body
    document.body.appendChild(form);

    // Adding event listener for form submission
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        const credentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch('https://01.kood.tech/api/auth/signin', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Invalid credentials or server error');
            }
            const token = await response.json();
            if (!token) {
                throw new Error('Token is missing in the response');
            }

            localStorage.setItem('jwt', token);

        } catch (error) {

            alert("Invalid login credentials");

        }

        location.reload();
    });
}
/*     // Adding event listener for authorButton click
    authorButton.addEventListener('click', function(event) {
        event.preventDefault();
        
        localStorage.setItem('jwt', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDI1MSIsImlhdCI6MTcyMjE0MzQ1MSwiaXAiOiIxNzIuMjMuMC4yIiwiZXhwIjoxNzIyMjI5ODUxLCJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWFsbG93ZWQtcm9sZXMiOlsidXNlciJdLCJ4LWhhc3VyYS1jYW1wdXNlcyI6Int9IiwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoidXNlciIsIngtaGFzdXJhLXVzZXItaWQiOiIxMDI1MSIsIngtaGFzdXJhLXRva2VuLWlkIjoiODNlYWVlZDEtYzFjOC00ZTQ0LTg2ZmQtNGU0MTNlMWM3NzAzIn19.9tgXKn36WY8WKPMvWoCvenoyGS-XrI_y3mFE7ABmspw');

        location.reload();
    });

} */