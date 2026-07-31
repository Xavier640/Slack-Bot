require("dotenv").config();
const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.event('app_mention', async ({ event, say }) => {
  try {
    await say(`Salut <@${event.user}>! Te aud clar din comanda integrată.`);
  } catch (error) {
    console.error('Eroare la trimiterea mesajului pe Slack:', error);
  }
});

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

(async () => {
  try {
    console.log("🔍 Verificare .env pe server:");
    console.log("BOT TOKEN EXISTĂ?:", !!process.env.SLACK_BOT_TOKEN);
    console.log("APP TOKEN EXISTĂ?:", !!process.env.SLACK_APP_TOKEN);

    await app.start();
    console.log("⚡️ Bot is running in Socket Mode!");
  } catch (error) {
    console.error("Eroare la pornirea serverului:", error);
  }
})();