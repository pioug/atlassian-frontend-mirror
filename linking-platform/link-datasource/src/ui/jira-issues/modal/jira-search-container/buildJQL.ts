type BuildJQLInput = {
  rawSearch: string;
  orderDirection?: string;
  orderKey?: string;
};

const fuzzySearchRegExp = /^"(.+)"$/;
const jiraIssueKeyRegExp = /[A-Z]+-\d+/;

export const buildJQL = (input: BuildJQLInput): string => {
  const { rawSearch, orderDirection = 'DESC', orderKey = 'created' } = input;

  const fuzzy = !rawSearch.match(fuzzySearchRegExp) ? '*' : '';
  const basicSearch = rawSearch.replace(/['"?*]+/g, '');

  const baseQueryParts = rawSearch.trim()
    ? [`text ~ "${basicSearch}${fuzzy}"`, `summary ~ "${basicSearch}${fuzzy}"`]
    : [];

  if (jiraIssueKeyRegExp.test(rawSearch)) {
    baseQueryParts.push(`key = "${basicSearch}"`);
  }

  const baseQueryContent = baseQueryParts.join(' OR ');
  const baseQuery = baseQueryContent ? `(${baseQueryContent})` : '';

  const limiter = rawSearch?.trim() ? '' : `created >= -30d`;
  const query = [baseQuery, limiter].filter(Boolean).join(' AND ');

  return `${query} order by ${orderKey} ${orderDirection.toUpperCase()}`;
};
