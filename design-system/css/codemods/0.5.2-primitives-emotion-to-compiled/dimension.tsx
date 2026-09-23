/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::3a39ce49b44c1d0b17f2d94639c1990f>>
 * @codegenCommand afm workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 */
export const dimensionMap = {
	'100%': '100%',
	'size.100': '1rem',
	'size.200': '1.5rem',
	'size.300': '2rem',
	'size.400': '2.5rem',
	'size.500': '3rem',
	'size.600': '6rem',
	'size.1000': '12rem',
} as const;
export type Dimension = keyof typeof dimensionMap;
