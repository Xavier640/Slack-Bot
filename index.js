require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

// 1. Inițializarea unică a robotului de Slack (folosim 'app')
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// 2. Ascultătorul de evenimente (răspunde când primește tag: @NumeBot)
app.event('app_mention', async ({ event, say }) => {
  try {
    await say(`Salut <@${event.user}>! Te aud clar din comanda integrată.`);
  } catch (error) {
    console.error('Eroare la trimiterea mesajului pe Slack:', error);
  }
});

// 3. Comenzile tale existente (/slash commands)
app.command("/balkan-guy-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/balkan-guy-catfact", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/balkan-guy-time", async ({ command, ack, respond }) => {
  await ack();
  const currentTime = new Date().toLocaleString();
  await respond({ text: `Current Time:\n${currentTime}` });
});

// 4. Pornirea unică a robotului
(async () => {
  try {
    await app.start();
    console.log("⚡️ Bot is running in Socket Mode!");
  } catch (error) {
    console.error("Eroare la pornirea serverului:", error);
  }
})();