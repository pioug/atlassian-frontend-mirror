/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::7e931a3b15648861e85392c4c0721fbb>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const fontMap: {
	'font.body': 'var(--ds-font-body)';
	'font.body.large': 'var(--ds-font-body-large)';
	'font.body.small': 'var(--ds-font-body-small)';
	'font.code': 'var(--ds-font-code)';
	'font.heading.large': 'var(--ds-font-heading-large)';
	'font.heading.medium': 'var(--ds-font-heading-medium)';
	'font.heading.small': 'var(--ds-font-heading-small)';
	'font.heading.xlarge': 'var(--ds-font-heading-xlarge)';
	'font.heading.xsmall': 'var(--ds-font-heading-xsmall)';
	'font.heading.xxlarge': 'var(--ds-font-heading-xxlarge)';
	'font.heading.xxsmall': 'var(--ds-font-heading-xxsmall)';
	'font.metric.large': 'var(--ds-font-metric-large)';
	'font.metric.medium': 'var(--ds-font-metric-medium)';
	'font.metric.small': 'var(--ds-font-metric-small)';
} = {
	'font.body': token(
		'font.body',
		'normal 400 14px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.body.large': token(
		'font.body.large',
		'normal 400 16px/24px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.body.small': token(
		'font.body.small',
		'normal 400 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.code': token(
		'font.code',
		'normal 400 0.875em/1 "Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
	),
	'font.heading.large': token(
		'font.heading.large',
		'normal 653 24px/28px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.medium': token(
		'font.heading.medium',
		'normal 653 20px/24px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.small': token(
		'font.heading.small',
		'normal 653 16px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xlarge': token(
		'font.heading.xlarge',
		'normal 653 28px/32px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xsmall': token(
		'font.heading.xsmall',
		'normal 653 14px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xxlarge': token(
		'font.heading.xxlarge',
		'normal 653 32px/36px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.heading.xxsmall': token(
		'font.heading.xxsmall',
		'normal 653 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.large': token(
		'font.metric.large',
		'normal 653 28px/32px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.medium': token(
		'font.metric.medium',
		'normal 653 24px/28px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.metric.small': token(
		'font.metric.small',
		'normal 653 16px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type Font = keyof typeof fontMap;
