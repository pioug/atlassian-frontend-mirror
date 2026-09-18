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
