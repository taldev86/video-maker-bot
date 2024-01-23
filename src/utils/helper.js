import UserAgent from 'user-agents';

/**
 * Helper function, Sanitizes the text for tts
 * @param {*} text
 */
export const sanitizeText = (text = "") => {
  // Sanitizes the text for tts
  // What gets removed:
  // - following characters`^_~@!&;#:-%“”‘"%*/{}[]()\|<>?=+`
  // - any http or https links
  const sanitizedText = text
    .replace(/[`^_~@!&;#:%“”‘"%*/{}[\]()\\|<>?=+]/g, '')
    .replace(/(https?:\/\/[^\s]+)/g, '')
    .replace('+', 'plus') // replace + with plus
    .replace('&', 'and') // replace & with and
    .replace(/  +/g, ' ') // replace multiple spaces with a single space
    .trim();

  return sanitizedText;
};

export const fakeUserAgent = async () => {
  const ua = new UserAgent({ deviceCategory: 'desktop' });
  return {
    'User-Agent': ua.toString(),
  };
};
