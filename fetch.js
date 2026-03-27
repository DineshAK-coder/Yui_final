import https from 'https';

https.get('https://brightedge.framer.website/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    // extract text from HTML roughly
    const text = data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                     .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                     .replace(/<[^>]+>/g, ' ')
                     .replace(/\s+/g, ' ')
                     .trim();
    console.log(text.substring(0, 5000));
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
