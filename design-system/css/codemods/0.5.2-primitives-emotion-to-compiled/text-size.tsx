/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::35853086e04fb88b0628ad4e2e517314>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const textSizeMap: {
	medium: 'var(--ds-font-body)';
	large: 'var(--ds-font-body-large)';
	small: 'var(--ds-font-body-small)';
} = {
	medium: token(
		'font.body',
		'normal 400 14px/20px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	large: token(
		'font.body.large',
		'normal 400 16px/24px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	small: token(
		'font.body.small',
		'normal 400 12px/16px "Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type TextSize = keyof typeof textSizeMap;
