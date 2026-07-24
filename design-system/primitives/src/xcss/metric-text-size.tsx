/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::307763aa0e0c3d0fd99081b500a80e85>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const metricTextSizeMap: {
	large: 'var(--ds-font-metric-large)';
	medium: 'var(--ds-font-metric-medium)';
	small: 'var(--ds-font-metric-small)';
} = {
	large: token(
		'font.metric.large',
		'normal 653 28px/32px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	medium: token(
		'font.metric.medium',
		'normal 653 24px/28px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	small: token(
		'font.metric.small',
		'normal 653 16px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type MetricTextSize = keyof typeof metricTextSizeMap;
