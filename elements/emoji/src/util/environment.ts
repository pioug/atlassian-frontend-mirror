const FEDRAMP_MODERATE = 'fedramp-moderate';

export function isFedRamp(): boolean {
  // MICROS_PERIMETER is already used by few products, so we need to keep it for backward compatibility
  const env =
    globalThis.MICROS_PERIMETER || globalThis.UNSAFE_ATL_CONTEXT_BOUNDARY;

  if (env) {
    return env === FEDRAMP_MODERATE;
  }

  const matches = globalThis.location?.hostname?.match(
    /atlassian-us-gov-mod\.com|atlassian-us-gov\.com|atlassian-fex\.(com|net)/,
  );

  return matches ? matches.length > 0 : false;
}
