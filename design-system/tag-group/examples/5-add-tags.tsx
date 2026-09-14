/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import TagGroup from '@atlaskit/tag-group/tag-group';
import Tag from '@atlaskit/tag/tag-new';
import { token } from '@atlaskit/tokens';

const tagNames = ['Design', 'Engineering', 'Research', 'Content', 'Analytics'];

const layoutStyles = css({
	display: 'flex',
	alignItems: 'flex-start',
	gap: token('space.150'),
	flexDirection: 'column',
});
const addButtonStyles = css({
	appearance: 'none',
	backgroundColor: token('color.background.neutral.bold'),
	borderRadius: token('radius.small'),
	borderStyle: 'none',
	color: token('color.text.inverse'),
	cursor: 'pointer',
	font: token('font.body'),
	fontWeight: token('font.weight.semibold'),
	paddingBlock: token('space.100'),
	paddingInline: token('space.150'),
	'&:hover': {
		backgroundColor: token('color.background.neutral.bold.hovered'),
	},
	'&:active': {
		backgroundColor: token('color.background.neutral.bold.pressed'),
	},
	'&:disabled': {
		cursor: 'not-allowed',
	},
});

export default function AddTagsToGroupExample(): JSX.Element {
	const [tags, setTags] = useState<string[]>([]);
	const nextTag = tagNames.find((tag) => !tags.includes(tag));

	return (
		<div css={layoutStyles}>
			<button
				css={addButtonStyles}
				disabled={nextTag === undefined}
				onClick={() => nextTag && setTags((currentTags) => [...currentTags, nextTag])}
				type="button"
			>
				Add tag
			</button>
			<TagGroup label="Project tags">
				{tags.map((tag) => (
					<Tag
						key={tag}
						text={tag}
						removeButtonLabel="Remove"
						onAfterRemoveAction={(removedTag) =>
							setTags((currentTags) => currentTags.filter((item) => item !== removedTag))
						}
					/>
				))}
			</TagGroup>
		</div>
	);
}
