export default {
  async fetch(request, env, ctx) {
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Website</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            transition: background 0.3s, color 0.3s;
          }
          .dark {
            background: #111;
            color: #f5f5f5;
          }
          .light {
            background: #fff;
            color: #111;
          }
          button {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          }
        </style>
      </head>
      <body class="light">
        <h1>This is my website and I might use it later</h1>
        <button onclick="toggleMode()">Toggle Dark/Light Mode</button>

        <script>
          function toggleMode() {
            const body = document.body;
            if (body.classList.contains('light')) {
              body.classList.remove('light');
              body.classList.add('dark');
            } else {
              body.classList.remove('dark');
              body.classList.add('light');
            }
          }
        </script>
      </body>
      </html>
      `,
      {
        headers: { "content-type": "text/html;charset=UTF-8" },
      }
    );
  },
};
