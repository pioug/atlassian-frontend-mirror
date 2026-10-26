/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::8209a90e93dd1e0c02251c8b20cdb201>>
 * @codegenCommand yarn build tokens
 */
export default `
html[data-theme~="spacing:UNSAFE-spacing"], [data-subtree-theme][data-theme~="spacing:UNSAFE-spacing"] {
  --ds-dynamic-space-gap-xxsmall-unrounded: max(0rem, 0.125rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-xsmall-unrounded: max(var(--ds-dynamic-space-gap-xxsmall-unrounded), 0.25rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0.09090909090909091, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-small-unrounded: max(var(--ds-dynamic-space-gap-xsmall-unrounded), 0.375rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0.18181818181818182, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-medium-unrounded: max(var(--ds-dynamic-space-gap-small-unrounded), 0.5rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0.2727272727272727, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-large-unrounded: max(var(--ds-dynamic-space-gap-medium-unrounded), 0.75rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0.45454545454545453, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-xlarge-unrounded: max(var(--ds-dynamic-space-gap-large-unrounded), 1rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(0.6363636363636364, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-gap-xxlarge-unrounded: max(var(--ds-dynamic-space-gap-xlarge-unrounded), 1.5rem * pow(var(--ds-dynamic-space-gap-scale, 1), var(--ds-dynamic-space-gap-uniformity, 0) + (1 - var(--ds-dynamic-space-gap-uniformity, 0)) * pow(1, var(--ds-dynamic-space-gap-curve, 1))));
  --ds-dynamic-space-inset-xxsmall-unrounded: max(0rem, 0.25rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-xsmall-unrounded: max(var(--ds-dynamic-space-inset-xxsmall-unrounded), 0.5rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.09090909090909091, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-small-unrounded: max(var(--ds-dynamic-space-inset-xsmall-unrounded), 0.75rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.18181818181818182, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-medium-unrounded: max(var(--ds-dynamic-space-inset-small-unrounded), 1rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.2727272727272727, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-large-unrounded: max(var(--ds-dynamic-space-inset-medium-unrounded), 1.25rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.36363636363636365, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-xlarge-unrounded: max(var(--ds-dynamic-space-inset-large-unrounded), 1.5rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.45454545454545453, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-xxlarge-unrounded: max(var(--ds-dynamic-space-inset-xlarge-unrounded), 2rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(0.6363636363636364, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-dynamic-space-inset-3xlarge-unrounded: max(var(--ds-dynamic-space-inset-xxlarge-unrounded), 3rem * pow(var(--ds-dynamic-space-inset-scale, 1), var(--ds-dynamic-space-inset-uniformity, 0) + (1 - var(--ds-dynamic-space-inset-uniformity, 0)) * pow(1, var(--ds-dynamic-space-inset-curve, 1))));
  --ds-space-0: 0rem;
  --ds-space-025: 0.125rem;
  --ds-space-050: 0.25rem;
  --ds-space-075: 0.375rem;
  --ds-space-100: 0.5rem;
  --ds-space-150: 0.75rem;
  --ds-space-200: 1rem;
  --ds-space-250: 1.25rem;
  --ds-space-300: 1.5rem;
  --ds-space-400: 2rem;
  --ds-space-500: 2.5rem;
  --ds-space-600: 3rem;
  --ds-space-800: 4rem;
  --ds-space-1000: 5rem;
  --ds-space-gap-large: calc(var(--ds-dynamic-space-gap-large-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-large-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-medium: calc(var(--ds-dynamic-space-gap-medium-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-medium-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-small: calc(var(--ds-dynamic-space-gap-small-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-small-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-xlarge: calc(var(--ds-dynamic-space-gap-xlarge-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-xlarge-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-xsmall: calc(var(--ds-dynamic-space-gap-xsmall-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-xsmall-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-xxlarge: calc(var(--ds-dynamic-space-gap-xxlarge-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-xxlarge-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-gap-xxsmall: calc(var(--ds-dynamic-space-gap-xxsmall-unrounded) * (1 - var(--ds-dynamic-space-gap-round, 1)) + round(nearest, var(--ds-dynamic-space-gap-xxsmall-unrounded), 1px) * var(--ds-dynamic-space-gap-round, 1));
  --ds-space-inset-3xlarge: calc(var(--ds-dynamic-space-inset-3xlarge-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-3xlarge-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-large: calc(var(--ds-dynamic-space-inset-large-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-large-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-medium: calc(var(--ds-dynamic-space-inset-medium-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-medium-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-small: calc(var(--ds-dynamic-space-inset-small-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-small-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-xlarge: calc(var(--ds-dynamic-space-inset-xlarge-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-xlarge-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-xsmall: calc(var(--ds-dynamic-space-inset-xsmall-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-xsmall-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-xxlarge: calc(var(--ds-dynamic-space-inset-xxlarge-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-xxlarge-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-inset-xxsmall: calc(var(--ds-dynamic-space-inset-xxsmall-unrounded) * (1 - var(--ds-dynamic-space-inset-round, 1)) + round(nearest, var(--ds-dynamic-space-inset-xxsmall-unrounded), 1px) * var(--ds-dynamic-space-inset-round, 1));
  --ds-space-negative-025: -0.125rem;
  --ds-space-negative-050: -0.25rem;
  --ds-space-negative-075: -0.375rem;
  --ds-space-negative-100: -0.5rem;
  --ds-space-negative-150: -0.75rem;
  --ds-space-negative-200: -1rem;
  --ds-space-negative-250: -1.25rem;
  --ds-space-negative-300: -1.5rem;
  --ds-space-negative-400: -2rem;
}
`;
