import type { ADFNodeGroup } from '@atlaskit/adf-schema-generator';
import { adfNodeGroup } from '@atlaskit/adf-schema-generator';

import { confluenceJiraIssue } from '../nodes/confluenceJiraIssue';
import { confluenceUnsupportedInline } from '../nodes/confluenceUnsupportedInline';
import { date } from '../nodes/date';
import { emoji } from '../nodes/emoji';
import { hardBreak } from '../nodes/hardBreak';
import { image } from '../nodes/image';
import { inlineCard } from '../nodes/inlineCard';
import { inlineExtension } from '../nodes/inlineExtension';
import { mediaInline } from '../nodes/mediaInline';
import { mention } from '../nodes/mention';
import { placeholder } from '../nodes/placeholder';
import { status } from '../nodes/status';
import { text } from '../nodes/text';
import { unsupportedInline } from '../nodes/unsupportedInline';

/**
 // eslint-disable-next-line eslint-plugin-jsdoc/check-tag-names
 * @DSLCompatibilityException
 *
 * Pseudo group used to match existing validator and json schema specs.
 *
 * Has slight differences from the original inlineGroup:
 * - no text
 * - no text.use('link_inline')
 */
export const inlineContentGroup: ADFNodeGroup = adfNodeGroup(
	'inline_content',
	[
		text.use('formatted'),
		text.use('code_inline'),
		date,
		emoji,
		hardBreak,
		inlineCard,
		mention,
		placeholder,
		status,
		inlineExtension.use('with_marks'),
		mediaInline,
		image,
		confluenceJiraIssue,
		confluenceUnsupportedInline,
		unsupportedInline,
	],
	{
		ignore: ['pm-spec', 'json-schema'],
	},
);
