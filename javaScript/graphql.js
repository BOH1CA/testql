import { createLoginForm } from './authentication.js'
import { fetchUserData } from './query.js'
import { createStatPage } from './statPage.js'


// Check if there is a token
if (localStorage.getItem('jwToken')) {

    // Check if the token is correct
    const userData = await fetchUserData();
    if (userData) {

        createStatPage(userData);

    } else {

        localStorage.removeItem('jwToken');
        location.reload();

    }

} else {

    createLoginForm();

}
