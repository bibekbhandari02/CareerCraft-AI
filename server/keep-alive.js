// Keep-alive service to prevent Render free tier cold starts
// Run this separately or use a cron service like cron-job.org

import https from 'https';

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (before 15 min timeout)
const API_URL = process.env.API_URL || 'https://portfolio-builder-api-9ejw.onrender.com';

function ping() {
  const url = `${API_URL}/api/ping`;
  
  https.get(url, (res) => {
    console.log(`[${new Date().toISOString()}] Ping successful: ${res.statusCode}`);
  }).on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Ping failed:`, err.message);
  });
}

// Initial ping
ping();

// Set up interval
setInterval(ping, PING_INTERVAL);

console.log(`Keep-alive service started. Pinging ${API_URL} every 14 minutes.`);
