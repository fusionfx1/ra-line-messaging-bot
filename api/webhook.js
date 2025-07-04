import { middleware, Client } from '@line/bot-sdk';
import { config } from 'dotenv';
config();

const client = new Client({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const events = req.body.events;
    await Promise.all(events.map(async (event) => {
      if (event.message?.type === 'text') {
        await client.replyMessage(event.replyToken, {
          type: 'text',
          text: 'คุณพิมพ์ว่า: ' + event.message.text,
        });
      }
    }));
    res.status(200).send('OK');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
