/**
 * Helper function to convert Vercel req/res to Web API Request/Response
 */
export async function createRequest(req) {
    // Build URL - Vercel provides req.url which may or may not include query string
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || req.headers['x-forwarded-host'] || 'localhost';
    const fullUrl = `${protocol}://${host}${req.url}`;
    const url = new URL(fullUrl);
    
    let body = undefined;
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
        // Vercel automatically parses JSON bodies, so stringify if it's an object
        if (req.body !== undefined && req.body !== null) {
            body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        }
    }
    
    // Create headers object, ensuring Content-Type is set for POST/PUT requests
    const headers = new Headers();
    Object.keys(req.headers).forEach(key => {
        const value = req.headers[key];
        if (value) {
            headers.set(key, Array.isArray(value) ? value.join(', ') : value);
        }
    });
    
    // Ensure Content-Type is set for requests with body
    if (body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }
    
    return new Request(url, {
        method: req.method,
        headers: headers,
        body: body,
    });
}

/**
 * Helper function to send Web API Response to Vercel res
 */
export async function sendResponse(response, res) {
    res.status(response.status);
    response.headers.forEach((value, key) => {
        res.setHeader(key, value);
    });
    const body = await response.text();
    res.send(body);
}
