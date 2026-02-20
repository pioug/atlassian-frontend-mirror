import type { ADFNodeGroup } from '@atlaskit/adf-schema-generator';
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

export const inlineGroup: ADFNodeGroup = adfNodeGroup(
	'inline',
	[
		text,
		text.use('link_inline'),
		text.use('formatted'),
		text.use('code_inline'),
		date,
		emoji,
		hardBreak,
		inlineCard,
		mention,
		placeholder,
		status,
		inlineExtension,
		inlineExtension.use('with_marks'),
		mediaInline,
		image,
		confluenceJiraIssue,
		confluenceUnsupportedInline,
		unsupportedInline,
	],
	{
		// @DSLCompatibilityException
		// Inline group in PM doesn't match ADF
		ignore: ['validator-spec'],
	},
);
