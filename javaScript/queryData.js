async function retriveData() {
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






