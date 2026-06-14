# Test Locally on Your Computer

## 1. Install Bun

If you do not have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## 2. Set Your OpenAI API Key

```bash
export OPENAI_API_KEY="your-key-here"
```

## 3. Run the App

```bash
bun run index.tsx
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

That is it. Bun will automatically install Hono and any dependencies, then start the server.

## Test With Your Own Image

1. Save your image somewhere accessible (or upload it to Imgur).
2. Replace the URL in your code:

```css
background-image: url('YOUR_IMAGE_URL_HERE');
```

3. Refresh the browser to see your image as the background.
