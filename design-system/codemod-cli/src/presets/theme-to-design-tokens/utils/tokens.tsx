import { light as rawTokens } from '@atlaskit/tokens/tokens-raw';

export const tokens = rawTokens
  .filter((t) => t.attributes.state === 'active')
  .map((t) => t.name.replace(/\.\[default\]/g, ''))
  .filter(
    (t) =>
      !t.includes('UNSAFE') &&
      !t.includes('interaction') &&
      !t.includes('chart') &&
      !t.includes('elevation.shadow.overflow'),
  );

export const getUniqueWordsFromTokens = tokens
  .reduce<string[]>((accum, val) => [...accum, ...val.split('.')], [])
  .reduce<string[]>(
    (accum, val) => [
      ...accum,
      ...val.split(/(?=[A-Z])/g).map((e: string) => e.toLowerCase()),
    ],
    [],
  )
  .reduce<string[]>((accum, val) => {
    if (!accum.includes(val)) {
      accum.push(val);
    }

    return accum;
  }, []);
