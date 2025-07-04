
RA Events LINE Messaging API Bot

✅ Features:
- Responds to LINE messages (!today / !all)
- Extracts event list from https://ra.co/events/th/bangkok
- Uses Puppeteer to scrape site
- Responds via LINE Messaging API

🛠 Setup:
1. Install Node.js and run:
   npm install express puppeteer cheerio @line/bot-sdk dotenv

2. Create .env file with:
   LINE_CHANNEL_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
   LINE_CHANNEL_SECRET=YOUR_CHANNEL_SECRET

3. Run the server:
   node app.js

4. Deploy to a public server and set Webhook URL in:
   https://developers.line.biz/console/

📩 Commands:
- !today = today’s events
- !all = recent 10 events
