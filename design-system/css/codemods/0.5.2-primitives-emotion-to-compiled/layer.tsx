/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::f44a80f6107b59b05c37024481dcfee1>>
 * @codegenCommand yarn workspace @atlaskit/primitives codegen-styles
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/dimensions.tsx <<SignedSource::cc9b3f12104c6ede803da6a42daac0b0>>
 * @codegenDependency ../../../primitives/scripts/codegen-file-templates/layer.tsx <<SignedSource::92793ca02dbfdad66e53ffbe9f0baa0a>>
 */
export const layerMap = {
	'1': 1,
	card: 100,
	navigation: 200,
	dialog: 300,
	layer: 400,
	blanket: 500,
	modal: 510,
	flag: 600,
	spotlight: 700,
	tooltip: 800,
} as const;

export type Layer = keyof typeof layerMap;
