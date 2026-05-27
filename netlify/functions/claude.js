// netlify/functions/claude.js
// Proxies Anthropic API calls with built-in web search enabled

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const body = JSON.parse(event.body);
    const { skipWebSearch, ...claudeBody } = body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.Anthropic_Key,
        "anthropic-version": "2023-06-01",
        ...(!skipWebSearch && { "anthropic-beta": "web-search-2025-03-05" }),
      },
      body: JSON.stringify({
        ...claudeBody,
        ...(!skipWebSearch && { tools: [{ type: "web_search_20250305", name: "web_search" }] }),
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
