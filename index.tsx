/** @jsx jsx */
/** @jsxImportSource hono/jsx */

import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import OpenAI from "openai";
const client = new OpenAI();

const app = new Hono();

// In-memory rate limiter: max 10 requests per IP per hour
const RATE_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

app.get("/pixel-crystal-ball.jpeg", serveStatic({ path: "./pixel-crystal-ball.jpeg" }));

app.get("/", (c) => {
    return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Mystical Psychic</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
        }
        .glow-effect {
          animation: glow 2s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .psychic-image {
          background-image: url('/pixel-crystal-ball.jpeg');
            background-size: cover;
            background-position: center;
        }
        @keyframes smokeRise1 {
          0%   { transform: translate(-50%, 0) scale(1);   opacity: 0; }
          20%  { opacity: 0.45; }
          100% { transform: translate(-50%, -110vh) scale(2.4); opacity: 0; }
        }
        @keyframes smokeRise2 {
          0%   { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
          20%  { opacity: 0.35; }
          100% { transform: translate(-50%, -110vh) scale(2.8); opacity: 0; }
        }
        @keyframes smokePulse {
          0%, 100% { opacity: 0.72; letter-spacing: 0.02em; }
          50% { opacity: 1; letter-spacing: 0.08em; }
        }
        .smoke-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow: hidden;
          background: rgba(2, 0, 20, 0.55);
          backdrop-filter: blur(1px);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .smoke-puff {
          position: absolute;
          bottom: -10%;
          left: 50%;
          border-radius: 9999px;
          filter: blur(40px);
          pointer-events: none;
        }
        .smoke-puff-1 {
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(216, 180, 254, 0.28), transparent 70%);
          animation: smokeRise1 5s ease-in infinite;
        }
        .smoke-puff-2 {
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(244, 114, 182, 0.22), transparent 70%);
          animation: smokeRise2 6.5s ease-in 1s infinite;
        }
        .smoke-puff-3 {
          width: 35vw; height: 35vw;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
          animation: smokeRise1 7s ease-in 2.5s infinite;
        }
        .smoke-puff-4 {
          width: 45vw; height: 45vw;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.18), transparent 70%);
          animation: smokeRise2 5.8s ease-in 0.5s infinite;
        }
        .smoke-label {
          position: relative;
          z-index: 1;
          animation: smokePulse 2.4s ease-in-out infinite;
          text-shadow: 0 0 18px rgba(216, 180, 254, 0.8), 0 2px 8px rgba(0,0,0,0.7);
        }
        .footer-readability {
          max-width: 42rem;
          margin: 0 auto;
          border: 1px solid rgba(216, 180, 254, 0.28);
          background: linear-gradient(180deg, rgba(2, 6, 23, 0.72), rgba(15, 23, 42, 0.88));
          backdrop-filter: blur(4px);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          box-shadow: 0 10px 30px rgba(2, 6, 23, 0.55);
        }
        .footer-title {
          color: #f3e8ff;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
        }
        .footer-subtitle {
          color: #e9d5ff;
          text-shadow: 0 1px 10px rgba(0, 0, 0, 0.65);
        }
      </style>
    </head>
    <body class="from-slate-900 via-purple-900 to-slate-900 min-h-screen flex items-center justify-center p-4 psychic-image">
      <div class="w-full max-w-2xl">>
          <form id="psychicForm" class="space-y-6">
            <div>
              <label for="question" class="sr-only">
                Your Question:
              </label>
              <textarea
                id="question"
                name="question"
                placeholder="Ask the psychic anything about your future..."
                required
                class="w-full h-[120px] px-4 py-3 bg-slate-700 border border-purple-400 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              class="block mx-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition duration-200 transform hover:scale-105"
            >
              🔮 Reveal Your Destiny
            </button>
          </form>

          <div id="loading" class="smoke-overlay" style="display:none;">
            <div class="smoke-puff smoke-puff-1"></div>
            <div class="smoke-puff smoke-puff-2"></div>
            <div class="smoke-puff smoke-puff-3"></div>
            <div class="smoke-puff smoke-puff-4"></div>
            <p class="smoke-label text-purple-100 font-semibold uppercase tracking-[0.2em] text-lg text-center">
              The spirits are communicating...
            </p>
          </div>

          <div id="prediction" class="hidden mt-8 fade-in">
            <div class="bg-gradient-to-r from-purple-900 to-pink-900 rounded-lg p-6 border border-purple-400 glow-effect h-[240px] overflow-y-auto">
              <p id="predictionText" class="text-gray-100 leading-relaxed text-lg min-h-full"></p>
            </div>
            <button
              id="askAnotherButton"
              type="button"
              class="w-full mt-4 bg-slate-700 hover:bg-slate-600 text-purple-300 font-semibold py-2 rounded-lg transition"
            >
              Ask Another Question
            </button>
          </div>

          <div id="error" class="hidden mt-8 bg-red-900 border border-red-500 rounded-lg p-4 text-red-200"></div>
      </div>

      <footer class="fixed bottom-4 left-0 w-full px-4 pointer-events-none">
        <div class="text-center footer-readability">
          <h1 class="text-3xl sm:text-4xl font-bold mb-1 footer-title">
            ✨ The Mystical Psychic ✨
          </h1>
        </div>
      </footer>

      <script>
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        const form = document.getElementById('psychicForm');
        const questionInput = document.getElementById('question');
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        const prediction = document.getElementById('prediction');
        const predictionText = document.getElementById('predictionText');
        const askAnotherButton = document.getElementById('askAnotherButton');

        function cleanPredictionText(text) {
          return text.replace(/\\*/g, '').replace(/\\s+/g, ' ').trim();
        }

        async function revealPredictionText(text) {
          const words = cleanPredictionText(text).split(/\\s+/);

          predictionText.textContent = '';

          for (const word of words) {
            predictionText.textContent += predictionText.textContent ? ' ' + word : word;
            await delay(120);
          }
        }

        async function handlePsychicSubmit(e) {
                 e.preventDefault();
          const question = document.getElementById('question').value;
          
          form.classList.add('hidden');
          loading.style.display = 'flex';
          error.classList.add('hidden');
          prediction.classList.add('hidden');

          try {
            const response = await fetch('/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ question })
            });

            const data = await response.json();

            loading.style.display = 'none';
            if (!response.ok) {
              predictionText.textContent = data.error || 'Something went wrong. Please try again.';
              prediction.classList.remove('hidden');
              if (response.status !== 429) {
                form.classList.remove('hidden');
              }
            } else {
              prediction.classList.remove('hidden');
              await revealPredictionText(data.prediction);
            }
          } catch (err) {
            loading.style.display = 'none';
            predictionText.textContent = err.message || 'Something went wrong. Please try again.';
            prediction.classList.remove('hidden');
            form.classList.remove('hidden');
          }
        }

        function resetPsychicForm() {
          document.getElementById('prediction').classList.add('hidden');
          document.getElementById('predictionText').textContent = '';
          error.classList.add('hidden');
          form.reset();
          form.classList.remove('hidden');
          questionInput.focus();
        }

        form.addEventListener('submit', handlePsychicSubmit);
        askAnotherButton.addEventListener('click', resetPsychicForm);
      </script>
    </body>
    </html>
  `);
});

app.post("/predict", async (c) => {
    const ip = c.req.header("x-forwarded-for")?.split(",")[0].trim()
        ?? c.req.header("x-real-ip")
        ?? "unknown";

    if (!checkRateLimit(ip)) {
        return c.json({ error: "You've reached the limit of questions today. Come back tomorrow." }, 429);
    }

    const { question } = await c.req.json();

    if (!question || question.trim().length === 0) {
        return c.json({ error: "Please ask a question" }, 400);
    }

    try {
        const response = await client.responses.create({
            model: "gpt-5.4",
            input: `You are a mystical psychic with ancient wisdom.
        Respond to the following question about the future with poetic, mysterious, and predictions.
        Keep responses between max 300 characters.
        Use mystical language and metaphors. Be vague but intriguing, like a real psychic would be.
        Use correct spelling and grammar.
        Return plain text only with no markdown, no asterisks, and no special formatting.
        Match question valence and tone.
        Never use dashes or semi-colons. Use commas and periods only.
        If a question is unserious, respond with as a troll would, with humor and sarcasm, with no psychic style.
        Question: ${question}`
        });

        if (response && response.output_text) {
            return c.json({ prediction: response.output_text });
        }

        throw new Error("OpenAI response did not include output text");
    } catch (err) {
        console.error("Prediction error:", err);
        return c.json(
            { error: "Failed to generate prediction. Please try again." },
            500
        );
    }
});

export default app;
