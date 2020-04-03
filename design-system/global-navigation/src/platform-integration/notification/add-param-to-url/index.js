// TODO: Check if we really need to use this package below
import UrlParse from 'url-parse';

export default (url, key, value) => {
  if (!key || !value) {
    return url;
  }
  const parsedUrl = UrlParse(url);
  const seperator = parsedUrl.query.length ? '&' : '?';
  parsedUrl.set(
    'query',
    `${parsedUrl.query}${seperator}${key}=${encodeURIComponent(value)}`,
  );
  return parsedUrl.href;
};
