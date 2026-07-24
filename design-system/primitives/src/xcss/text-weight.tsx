/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::771460ab0c298bfffbf486012c7cfab6>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const textWeightMap: {
	bold: 'var(--ds-font-weight-bold)';
	medium: 'var(--ds-font-weight-medium)';
	regular: 'var(--ds-font-weight-regular)';
	semibold: 'var(--ds-font-weight-semibold)';
} = {
	bold: token('font.weight.bold', '653'),
	medium: token('font.weight.medium', '500'),
	regular: token('font.weight.regular', '400'),
	semibold: token('font.weight.semibold', '600'),
};

export type TextWeight = keyof typeof textWeightMap;
