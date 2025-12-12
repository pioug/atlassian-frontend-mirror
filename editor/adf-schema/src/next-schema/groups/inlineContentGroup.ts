import { adfNodeGroup } from '@atlaskit/adf-schema-generator';
import { date } from '../nodes/date';
import { emoji } from '../nodes/emoji';
import { hardBreak } from '../nodes/hardBreak';
import { inlineCard } from '../nodes/inlineCard';
import { mention } from '../nodes/mention';
import { placeholder } from '../nodes/placeholder';
import { text } from '../nodes/text';
import { status } from '../nodes/status';
import { inlineExtension } from '../nodes/inlineExtension';
import { mediaInline } from '../nodes/mediaInline';
import { unsupportedInline } from '../nodes/unsupportedInline';
import { confluenceUnsupportedInline } from '../nodes/confluenceUnsupportedInline';
import { image } from '../nodes/image';
import { confluenceJiraIssue } from '../nodes/confluenceJiraIssue';

/**
 * @DSLCompatibilityException
 *
 * Pseudo group used to match existing validator and json schema specs.
 *
 * Has slight differences from the original inlineGroup:
 * - no text
 * - no text.use('link_inline')
 */
export const inlineContentGroup = adfNodeGroup(
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
