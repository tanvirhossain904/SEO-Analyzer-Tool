const dns = require('dns').promises;
const ipaddr = require('ipaddr.js');

const BLOCKED_RANGES = ['private', 'loopback', 'linkLocal', 'uniqueLocal', 'reserved'];

function isPublicIp(ip) {
  try {
    const parsed = ipaddr.parse(ip);
    const range = parsed.range();
    return !BLOCKED_RANGES.includes(range);
  } catch {
    return false;
  }
}

async function assertUrlIsPublic(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http(s) URLs are allowed.');
  }

  const hostname = parsed.hostname;
  if (!hostname) throw new Error('URL has no hostname.');

  // Reject IP literals that are private/loopback up front.
  if (ipaddr.isValid(hostname) && !isPublicIp(hostname)) {
    throw new Error('URLs targeting private or loopback addresses are not allowed.');
  }

  // Resolve DNS and reject if any answer is a private/reserved address.
  let addresses;
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error('Could not resolve URL hostname.');
  }

  for (const { address } of addresses) {
    if (!isPublicIp(address)) {
      throw new Error('URL resolves to a private or reserved address.');
    }
  }
}

module.exports = { assertUrlIsPublic };
