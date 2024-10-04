import { loginForm } from './authentication.js'
import { retriveData } from './queryData.js'
import { displayStats } from './graphPage.js'


// Check if there is a token
if (localStorage.getItem('jwToken')) {

    // Check if the token is correct
    const userData = await retriveData();
    if (userData) {

        displayStats(userData);

    } else {

        localStorage.removeItem('jwToken');
        location.reload();

    }

} else {

    loginForm();

}
