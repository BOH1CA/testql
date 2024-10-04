async function getJwtToken() {
    const jwToken = localStorage.getItem('jwToken');
    if (!jwToken) {
        throw new Error('JWT token not found. Please log in.');
    }
    return jwToken;
}

async function fetchGraphQLData(query, token) {
    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.errors?.[0]?.message || 'Network response was not ok';
        throw new Error(errorMessage);
    }

    return await response.json();
}

function extractUserData(responseData) {
    const user = responseData?.data?.user?.[0];
    if (!user) {
        throw new Error('User data not found in response');
    }
    return user;
}

export async function retriveData() {
    try {
        const jwToken = await getJwtToken();
        console.debug('Using token:', jwToken); // Log token for debugging
        
        const query = `
        query {
          user {
            id
            login
            auditRatio
            totalUp
            totalDown
          }
          transaction (
            order_by: { createdAt: desc }
            where: { 
              type: { _eq: "xp" }
              path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
            }
          ) {
            amount
            objectId
            userId
            path
            type
            object {
              name
            }
          }
          xpProgress: transaction (
            order_by: { createdAt: asc }
            where: { 
              type: { _eq: "xp" }
              path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
            }
          ) {
            amount
            createdAt
          }
          projectsLowtoHighXp: transaction (
            order_by: { amount: desc }
            where: { 
              type: { _eq: "xp" }
              path: { _regex: "^\\/johvi\\/div-01\\/(?!piscine-js\\/).*$" }
            }
            limit: 10
          ) {
            amount
            objectId
            path
            type
            object {
              name
            }
          }
        }
      `;
      
        const responseData = await fetchGraphQLData(query, jwToken);
        console.debug('GraphQL Response:', responseData); // Log for debugging

        // Extract user data
        const userData = responseData.data?.user?.[0];
        if (!userData) {
            throw new Error('User data not found in response');
        }
        
        const transactionsData = responseData.data.transaction || [];
        const xpProgressData = responseData.data.xpProgress || [];
        const projectsData = responseData.data.projectsLowtoHighXp || [];

        return { userData, transactionsData, xpProgressData, projectsData }; // Return all relevant data
        
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        throw error; // Rethrow the error for further handling
    }
}






