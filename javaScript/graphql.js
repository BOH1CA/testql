import { loginForm } from './authentication.js'
import { retriveData } from './queryData.js'
import { createStatPage } from './statPage.js'


// Check if there is a token
if (localStorage.getItem('jwToken')) {

    // Check if the token is correct
    const userData = await retriveData();
    if (userData) {

        createStatPage(userData);

    } else {

        localStorage.removeItem('jwToken');
        location.reload();

    }

} else {

    loginForm();

}
