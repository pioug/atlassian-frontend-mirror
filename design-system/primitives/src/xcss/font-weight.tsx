/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::45dd1de71dbd395ec11ae36c4fe5f287>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const fontWeightMap: {
	'font.weight.bold': 'var(--ds-font-weight-bold)';
	'font.weight.medium': 'var(--ds-font-weight-medium)';
	'font.weight.regular': 'var(--ds-font-weight-regular)';
	'font.weight.semibold': 'var(--ds-font-weight-semibold)';
} = {
	'font.weight.bold': token('font.weight.bold', '653'),
	'font.weight.medium': token('font.weight.medium', '500'),
	'font.weight.regular': token('font.weight.regular', '400'),
	'font.weight.semibold': token('font.weight.semibold', '600'),
};

export type FontWeight = keyof typeof fontWeightMap;
