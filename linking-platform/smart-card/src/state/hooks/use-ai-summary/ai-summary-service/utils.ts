export const getBufferReader = (
  response: Response,
): ReadableStreamDefaultReader<string> => {
  if (!response.body) {
    throw new Error('Response body is empty');
  }
  return response.body.pipeThrough(new TextDecoderStream()).getReader();
};

export const addPath = (baseUrl: string, path: string) => {
  const urlWithTrailingSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const pathWithoutLeadingSlash = !path.startsWith('/')
    ? path
    : path.substring(1, path.length);
  const url = [urlWithTrailingSlash, pathWithoutLeadingSlash].join('');
  return url;
};
