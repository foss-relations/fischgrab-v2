module.exports = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || 'Unknown';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  const timestamp = new Date().toISOString();

  try {
    const webhookUrl = process.env.DISC_HOOK;
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return res.status(200).json({ message: 'Webhook not configured' });
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [
          {
            title: 'New Visitor',
            color: 0x00ff00,
            fields: [
              { name: 'IP Address', value: ip, inline: true },
              { name: 'User Agent', value: userAgent, inline: true },
              { name: 'Timestamp', value: timestamp, inline: true },
            ],
          },
        ],
      }),
    });

    res.status(200).json({ message: 'Logged successfully' });
  } catch (error) {
    console.error('Error sending to Discord:', error);
    res.status(200).json({ message: 'Error logging visitor' });
  }
};
