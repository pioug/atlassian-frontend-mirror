import type { Format } from 'style-dictionary';

const formatter: Format['formatter'] = ({ dictionary, options }) => {
  const tokens = options?.groups
    ? dictionary.allTokens.filter(
        (token) =>
          token.attributes && options.groups.includes(token.attributes.group),
      )
    : dictionary.allTokens;

  return `
// THIS IS AN AUTO-GENERATED FILE DO NOT MODIFY DIRECTLY
// Re-generate by running \`yarn build tokens\`.

const tokens = ${JSON.stringify(tokens, null, 2)};

export default tokens;
`;
};

export default formatter;
