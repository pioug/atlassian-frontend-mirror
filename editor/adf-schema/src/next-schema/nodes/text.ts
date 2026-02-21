import type { ADFCommonNodeSpec, ADFNode } from '@atlaskit/adf-schema-generator';
import { adfNode } from '@atlaskit/adf-schema-generator';
import { annotation } from '../marks/annotation';
import { code } from '../marks/code';
import { em } from '../marks/em';
import { link } from '../marks/link';
import { strike } from '../marks/strike';
import { strong } from '../marks/strong';
import { subsup } from '../marks/subsup';
import { underline } from '../marks/underline';
import { backgroundColor, textColor } from '../marks/color';
import { unsupportedNodeAttribute } from '../marks/unsupportedNodeAttribute';
import { unsupportedMark } from '../marks/unsupportedMark';
import { typeAheadQuery } from '../marks/typeAheadQuery';
import { confluenceInlineComment } from '../marks/confluenceInlineComment';

export const text: ADFNode<
	[string, 'with_no_marks', 'link_inline', 'formatted', 'code_inline'],
	ADFCommonNodeSpec & {
		marks: never[];
		noMarks: true;
	} & {
		ignore: ('pm-spec' | 'json-schema')[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	} & {
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				'props.marks.items[0][9]': {
					reason: string;
					remove: true;
				};
			};
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	} & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		marks: any[];
	}
> = adfNode('text')
	.define({
		marks: [],
		hasEmptyMarks: true,
	})
	.variant('with_no_marks', {
		marks: [],
		noMarks: true,
	})
	.variant('link_inline', {
		marks: [link],
		ignore: ['pm-spec', 'json-schema'],
	})
	.variant('formatted', {
		marks: [
			link,
			em,
			strong,
			strike,
			subsup,
			underline,
			textColor,
			annotation,
			backgroundColor,
			typeAheadQuery,
			confluenceInlineComment,
			unsupportedNodeAttribute,
			unsupportedMark,
		],
		DANGEROUS_MANUAL_OVERRIDE: {
			'validator-spec': {
				// Refers to confluence inline comment value (9th on list)
				'props.marks.items[0][9]': {
					remove: true,
					reason:
						'@DSLCompatibilityException - Confluence inline comment is not matched on the validator',
				},
			},
		},
	})
	.variant('code_inline', {
		marks: [code, link, annotation, unsupportedMark, unsupportedNodeAttribute],
	});
