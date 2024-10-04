import { createLoginForm } from './login.js'
import { fetchUserData } from './query.js'
import { createStatPage } from './statPage.js'

// TO REMOVE EXISTING TOKEN
// localStorage.removeItem('jwt');

// TO ADD INVALID TOKEN
// localStorage.setItem('jwt', 'invalidTokenValue');

// Check if there is a token
if (localStorage.getItem('jwt')) {

    // Check if the token is correct
    const userData = await fetchUserData();
    if (userData) {

        createStatPage(userData);

    } else {

        localStorage.removeItem('jwt');
        location.reload();

    }

} else {

    createLoginForm();

}
