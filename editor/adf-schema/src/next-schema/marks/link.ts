import { adfMark, adfMarkGroup } from '@atlaskit/adf-schema-generator';

export const link = adfMark('link');

// import { linkMarketGroup } from '../groups/linkMarkGroup' would cause circular deps issue
const linkMarkGroup = adfMarkGroup('link', [link]);

link.define({
	// it seems unnessary to have it here?
	excludes: [linkMarkGroup],
	inclusive: false,
	attrs: {
		href: { type: 'string', validatorFn: 'safeUrl' },
		title: { type: 'string', optional: true },
		id: { type: 'string', optional: true },
		collection: { type: 'string', optional: true },
		occurrenceKey: { type: 'string', optional: true },

		// TODO: ED-29537 - expand object
		// packages/adf-schema/src/schema/marks/link.ts
		__confluenceMetadata: { type: 'object', optional: true, default: null },
	},
});
