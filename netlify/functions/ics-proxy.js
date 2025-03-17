// netlify/functions/ics-proxy.js

import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    // 1) Read "url" query param
    const { url } = event.queryStringParameters || {};
    if (!url) {
      return {
        statusCode: 400,
        body: 'Missing ?url= param',
      };
    }

    // 2) Fetch the target ICS or resource
    const upstreamResponse = await fetch(url);
    if (!upstreamResponse.ok) {
      return {
        statusCode: upstreamResponse.status,
        body: `Upstream error: ${upstreamResponse.statusText}`,
      };
    }

    // 3) Read the text from the upstream
    const text = await upstreamResponse.text();

    // 4) Return it with CORS header
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain',
      },
      body: text,
    };
  } catch (err) {
    console.error('Error in ics-proxy function:', err);
    return {
      statusCode: 500,
      body: `Server error: ${err.message}`,
    };
  }
}

