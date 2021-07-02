import tokens, { CSSTokenMap } from './tokens/token-names';
type tokenSchema = typeof tokens;

function token<T extends keyof tokenSchema>(
  path: T,
  fallback?: string,
): CSSTokenMap[T] {
  if (process.env.NODE_ENV !== 'production' && !tokens[path]) {
    throw new Error(`Unknown token at path: ${path}`);
  }

  const token: tokenSchema[T] = tokens[path];

  const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;

  return tokenCall as CSSTokenMap[T];
}

export default token;
