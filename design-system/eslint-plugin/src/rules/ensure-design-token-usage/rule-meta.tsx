import type { LintRuleMeta } from '@atlaskit/eslint-utils/create-rule';

import type { Domains } from './types';

const domainsToLint: Domains = ['color', 'spacing', 'shape'];

const ruleMeta: {
	readonly name: 'ensure-design-token-usage';
	readonly hasSuggestions: true;
	readonly schema: {
		readonly type: 'array';
		readonly items: {
			readonly type: 'object';
			readonly properties: {
				readonly applyImport: {
					readonly type: 'boolean';
				};
				readonly shouldEnforceFallbacks: {
					readonly type: 'boolean';
				};
				readonly domains: {
					readonly type: 'array';
					readonly items: {
						readonly enum: Domains;
					};
				};
				readonly exceptions: {
					readonly type: 'array';
				};
			};
		};
	};
	readonly type: 'problem';
	readonly fixable: 'code';
	readonly docs: {
		readonly description: 'Enforces usage of design tokens rather than hard-coded values.';
		readonly recommended: true;
		readonly severity: 'error';
	};
	readonly messages: {
		readonly noRawRadiusValues: 'Replace the raw radius or border width with a matching radius.* token or the border.width token family using token() from @atlaskit/tokens.\n\n@meta <<{{payload}}>>';
		readonly noRawSpacingValues: "Replace raw spacing with a semantic space.* token using token() from @atlaskit/tokens, or use a compiled layout primitive's spacing API.\n\n@meta <<{{payload}}>>";
		readonly autofixesPossible: 'Apply the offered spacing suggestion to replace mapped values with tokens, then check that the chosen spacing preserves the layout.';
		readonly noCalcUsage: 'Replace this spacing calc() with an appropriate space.* token from @atlaskit/tokens; select a supported scale value that preserves the intended layout.';
		readonly hardCodedColor: "Import token from @atlaskit/tokens and replace the raw colour with a semantic token call, such as token('color.text') for default text; choose the token for the element's purpose.";
		readonly legacyElevation: "Replace legacy elevation helpers with the matching elevation.surface.* backgroundColor and elevation.shadow.* boxShadow tokens from @atlaskit/tokens; choose the surface's intended elevation.";
	};
} = {
	name: 'ensure-design-token-usage',
	hasSuggestions: true,
	schema: {
		type: 'array',
		items: {
			type: 'object',
			properties: {
				applyImport: {
					type: 'boolean',
				},
				shouldEnforceFallbacks: {
					type: 'boolean',
				},
				domains: {
					type: 'array',
					items: {
						enum: domainsToLint,
					},
				},
				exceptions: {
					type: 'array',
				},
			},
		},
	},
	type: 'problem',
	fixable: 'code',
	docs: {
		description: 'Enforces usage of design tokens rather than hard-coded values.',
		recommended: true,
		severity: 'error',
	},
	messages: {
		noRawRadiusValues:
			'Replace the raw radius or border width with a matching radius.* token or the border.width token family using token() from @atlaskit/tokens.\n\n@meta <<{{payload}}>>',
		noRawSpacingValues:
			"Replace raw spacing with a semantic space.* token using token() from @atlaskit/tokens, or use a compiled layout primitive's spacing API.\n\n@meta <<{{payload}}>>",
		autofixesPossible:
			'Apply the offered spacing suggestion to replace mapped values with tokens, then check that the chosen spacing preserves the layout.',
		noCalcUsage:
			'Replace this spacing calc() with an appropriate space.* token from @atlaskit/tokens; select a supported scale value that preserves the intended layout.',
		hardCodedColor:
			"Import token from @atlaskit/tokens and replace the raw colour with a semantic token call, such as token('color.text') for default text; choose the token for the element's purpose.",
		legacyElevation:
			"Replace legacy elevation helpers with the matching elevation.surface.* backgroundColor and elevation.shadow.* boxShadow tokens from @atlaskit/tokens; choose the surface's intended elevation.",
	},
} as const satisfies LintRuleMeta;

export default ruleMeta;
