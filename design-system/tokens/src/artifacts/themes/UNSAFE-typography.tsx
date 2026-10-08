/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e906bfc89e43ae47c6e2897bee27836e>>
 * @codegenCommand yarn build tokens
 */
export default `
html[data-theme~="typography:UNSAFE-typography"], [data-subtree-theme][data-theme~="typography:UNSAFE-typography"] {
  --ds-font-heading-xxlarge: normal 653 calc(2rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxlarge-scale, 1))/calc(2.25rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxlarge-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-xlarge: normal 653 calc(1.75rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xlarge-scale, 1))/calc(2rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xlarge-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-large: normal 653 calc(1.5rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-large-scale, 1))/calc(1.75rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-large-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-medium: normal 653 calc(1.25rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-medium-scale, 1))/calc(1.5rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-medium-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-small: normal 653 calc(1rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-small-scale, 1))/calc(1.25rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-small-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-xsmall: normal 653 calc(0.875rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xsmall-scale, 1))/calc(1.25rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xsmall-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-heading-xxsmall: normal 653 calc(0.75rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxsmall-scale, 1))/calc(1rem * var(--ds-dynamic-font-scale, 1) * var(--ds-dynamic-font-heading-xxsmall-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-body-large: normal 400 calc(1rem * var(--ds-dynamic-font-scale, 1))/calc(1.5rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-body: normal 400 calc(0.875rem * var(--ds-dynamic-font-scale, 1))/calc(1.25rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-body-small: normal 400 calc(0.75rem * var(--ds-dynamic-font-scale, 1))/calc(1rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-metric-large: normal 653 calc(1.75rem * var(--ds-dynamic-font-scale, 1))/calc(2rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-metric-medium: normal 653 calc(1.5rem * var(--ds-dynamic-font-scale, 1))/calc(1.75rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-metric-small: normal 653 calc(1rem * var(--ds-dynamic-font-scale, 1))/calc(1.25rem * var(--ds-dynamic-font-scale, 1)) var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-code: normal 400 calc(0.875em * var(--ds-dynamic-font-scale, 1))/calc(1 * var(--ds-dynamic-font-scale, 1)) "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace;
  --ds-font-weight-regular: 400;
  --ds-font-weight-medium: 500;
  --ds-font-weight-semibold: 600;
  --ds-font-weight-bold: 653;
  --ds-font-family-heading: var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-family-body: var(--ds-dynamic-font-family, "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-family-code: "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace;
  --ds-font-family-brand-heading: var(--ds-dynamic-font-family, "Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
  --ds-font-family-brand-body: var(--ds-dynamic-font-family, "Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif);
}
`;
