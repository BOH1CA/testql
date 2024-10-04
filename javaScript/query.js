export async function fetchUserData() {
    const jwToken = localStorage.getItem('jwToken');
    if (!jwToken) {
        throw new Error('jwToken not found');
    }

    try {
        // Log token for debugging
        console.log('Using token:', jwToken);

        // Make the GraphQL query
        const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwToken}`,
            },
            body: JSON.stringify({
                query: `
                    query {
                        user {
                        login
                        auditRatio
                        audits_aggregate (
                            where:{grade:{_neq:0}}){
                            aggregate {
                                count
                            }
                        }
                        attrs
                        transactions(
                            order_by: [{ type: asc }, { amount: asc }]
                            distinct_on: [type]
                            where: { type: { _like: "skill_%" }}
                        )   { 
                            type
                            amount
                        }
                        xps(
                            where: { path: { _nregex: "piscine-(go|js)" } }
                            order_by: { amount: asc }
                        )   {
                            amount
                            path
                            }
                        progresses(
                            order_by: { createdAt: asc }
                            where: { path: { _nregex: "piscine-(go|js)" } }
                        )   {
                            createdAt
                            path
                            }
                        }
                    }
                `
            })
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Log the full response for debugging
        const responseData = await response.json();
        console.log('GraphQL Response:', responseData);

        // Check if data and user field exists
        const { data } = responseData;
        if (data && data.user && data.user.length > 0) {
            return data.user[0]; // Return the first user object
        } else {
            throw new Error('User data not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return false;
    }
}
