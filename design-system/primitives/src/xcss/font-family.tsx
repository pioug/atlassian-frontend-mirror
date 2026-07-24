/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d46fa1415e9618559c3725b5d922ea57>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
import { token } from '@atlaskit/tokens';

export const fontFamilyMap: {
	'font.family.body': 'var(--ds-font-family-body)';
	'font.family.brand.body': 'var(--ds-font-family-brand-body)';
	'font.family.brand.heading': 'var(--ds-font-family-brand-heading)';
	'font.family.code': 'var(--ds-font-family-code)';
	'font.family.heading': 'var(--ds-font-family-heading)';
} = {
	'font.family.body': token(
		'font.family.body',
		'"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.brand.body': token(
		'font.family.brand.body',
		'"Charlie Text", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.brand.heading': token(
		'font.family.brand.heading',
		'"Charlie Display", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
	'font.family.code': token(
		'font.family.code',
		'"Atlassian Mono", ui-monospace, Menlo, "Segoe UI Mono", "Ubuntu Mono", monospace',
	),
	'font.family.heading': token(
		'font.family.heading',
		'"Atlassian Sans", ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, "Helvetica Neue", sans-serif',
	),
};

export type FontFamily = keyof typeof fontFamilyMap;
