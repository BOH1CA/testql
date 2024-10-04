// Function to create and display the login form
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

        const encodeInfo = btoa(`${username}:${password}`);

        try {
            const response = await fetch('https://01.kood.tech/api/auth/signin', {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${encodeInfo}`,
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

            localStorage.setItem('jwToken', token);

        } catch (error) {

            alert("Invalid login credentials");

        }

        location.reload();
    });
}

