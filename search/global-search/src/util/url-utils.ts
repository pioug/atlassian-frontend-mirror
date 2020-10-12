export const addQueryParam = (
  url: string,
  queryName: string,
  queryValue: string | undefined,
) => {
  if (!url || !queryName) {
    return url;
  }

  const urlSplit = url.split('?');
  const queryString = urlSplit.length === 2 ? urlSplit[1] : null;
  const urlWithoutQuery = urlSplit.length > 0 ? urlSplit[0] : '';

  const encodedQueryName = encodeURIComponent(queryName);
  const newQueryItem = `${encodedQueryName}=${encodeURIComponent(
    queryValue || '',
  )}`;

  // If url has no existing query strings
  if (!queryString) {
    return `${url}?${newQueryItem}`;
  }

  const existingQueries = queryString.split('&');

  const newQueryString = existingQueries
    .filter(query => {
      // If the query already exists we will replace it with the new one so we filter it out here
      return !query.startsWith(`${encodedQueryName}=`);
    })
    .concat(newQueryItem)
    .join('&');

  return `${urlWithoutQuery}?${newQueryString}`;
};
