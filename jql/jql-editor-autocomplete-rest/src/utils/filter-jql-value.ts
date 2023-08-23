import { areStringsEquivalent, isQuoted, normalize } from './strings';

type JqlValue = {
  displayName: string;
  value: string;
};

export const filterJqlValue = (
  { displayName, value }: JqlValue,
  query?: string,
) => {
  if (typeof query !== 'string' || query === '') {
    return true;
  }

  const normalizedQuery = normalize(query);
  const normalizedDisplayName = normalize(displayName);
  const normalizedValue = normalize(value);

  // If query is quoted, then we only return exact matches with the JQL value
  if (isQuoted(query)) {
    return areStringsEquivalent(normalizedQuery, normalizedValue);
  }

  return (
    areStringsEquivalent(
      normalizedQuery,
      normalizedDisplayName.substring(0, normalizedQuery.length),
    ) ||
    areStringsEquivalent(
      normalizedQuery,
      normalizedValue.substring(0, normalizedQuery.length),
    )
  );
};
