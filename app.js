
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const client = new line.Client(config);
app.post('/webhook', line.middleware(config), async (req, res) => {
  const events = req.body.events;
  const results = await Promise.all(events.map(handleEvent));
  res.json(results);
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return null;
  }

  const text = event.message.text.toLowerCase();

  if (text.includes('!today')) {
    const todayEvents = await fetchTodayEvents();
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: todayEvents || 'ไม่พบอีเวนต์วันนี้ครับ',
    });
  } else if (text.includes('!all')) {
    const allEvents = await fetchAllEvents();
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: allEvents,
    });
  } else {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'พิมพ์ !today เพื่อดูอีเวนต์วันนี้ หรือ !all เพื่อดูทั้งหมดครับ',
    });
  }
}

async function fetchRAHtml() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://ra.co/events/th/bangkok', { waitUntil: 'networkidle2' });
  await page.waitForSelector('main');
  const content = await page.content();
  await browser.close();
  return content;
}

function extractEvents(html) {
  const $ = cheerio.load(html);
  const events = [];
  $('a.event-item').each((i, el) => {
    const title = $(el).find('.title').text().trim();
    const date = $(el).find('.date').text().trim();
    if (title && date) events.push(`${date}: ${title}`);
  });
  return events;
}

async function fetchTodayEvents() {
  const html = await fetchRAHtml();
  const events = extractEvents(html);
  const today = new Date().toLocaleDateString('en-GB');
  return events.filter(e => e.includes(today)).join('\n');
}

async function fetchAllEvents() {
  const html = await fetchRAHtml();
  const events = extractEvents(html);
  return events.slice(0, 10).join('\n');
}

app.listen(PORT, () => {
  console.log(`🚀 LINE Bot server running on port ${PORT}`);
});
