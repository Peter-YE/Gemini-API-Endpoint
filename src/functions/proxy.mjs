// function.mjs
import { app } from '@azure/functions';
import fetch from 'node-fetch';

const pickHeaders = (headers, keys) => {
    const picked = new Headers();
    for (const key of headers.keys()) {
        if (keys.some((k) => (typeof k === "string" ? k === key : k.test(key)))) {
            const value = headers.get(key);
            if (typeof value === "string") {
                picked.set(key, value);
            }
        }
    }
    return picked;
};


app.http('proxy', {
    methods: ['GET', 'POST', 'PUT'],
    authLevel: 'anonymous',
    route: 'proxy/{*rest}',
    handler: async (req, context) => {

        context.log('HTTP trigger function processed a request.');
        const rest = req.params.rest;
        const query = req.query;
        // Construct the forwarded URL
        const forwardedUrl = `https://generativelanguage.googleapis.com/${rest}?${new URLSearchParams(query)}`;
        const headers = pickHeaders(req.headers, ["content-type", "x-goog-api-client", "x-goog-api-key", "accept-encoding"]);

        // Read the entire request body
        const chunks = [];
        for await (const chunk of req.body) {
            chunks.push(chunk);
        }
        const body = Buffer.concat(chunks);

        // Log the forwarded URL and headers
        context.log('Forwarded URL: ' + forwardedUrl);
        context.log('Headers: ' + JSON.stringify(headers));

        // Make a request to the forwarded URL and log the response
        const response = await fetch(forwardedUrl, {
            method: req.method,
            headers: headers,
            duplex: 'half',
            body: body
        });
        const responseHeaders = pickHeaders(response.headers, ["content-type", "content-length", "content-encoding"]);
        responseHeaders.set("content-encoding", "null")

        return new Response(response.body, { status: response.status, headers: pickHeaders(responseHeaders, ["content-type", "content-length", "content-encoding"]) });
    }
});