// Cloudflare Worker code
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    const firebaseURL = `https://shortlink-d23af-default-rtdb.asia-southeast1.firebasedatabase.app/links/${id}.json`;

    const res = await fetch(firebaseURL);
    const data = await res.json();

    if (!data || !data.link) {
      return new Response(`<h1>Invalid or missing link ID.</h1>`, {
        headers: { "Content-Type": "text/html" }
      });
    }

    const html = \`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>\${data.title}</title>

        <!-- Open Graph meta tags -->
        <meta property="og:title" content="\${data.title}" />
        <meta property="og:description" content="\${data.desc}" />
        <meta property="og:image" content="\${data.img || 'https://via.placeholder.com/600x400'}" />
        <meta property="og:url" content="\${url.href}" />
        <meta name="twitter:card" content="summary_large_image" />

        <!-- Redirect after preview -->
        <meta http-equiv="refresh" content="2;url=\${data.link}" />
      </head>
      <body>
        <p>Redirecting to <a href="\${data.link}">\${data.link}</a>...</p>
      </body>
      </html>
    \`;

    return new Response(html, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  }
}