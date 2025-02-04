/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';
import { token } from '@atlaskit/tokens';

const layoutStyles = css({
	display: 'flex',
	gap: token('space.300', '24px'),
	flexDirection: 'column',
	paddingBlockEnd: token('space.300', '24px'),
	paddingBlockStart: token('space.300', '24px'),
	paddingInlineEnd: 0,
	paddingInlineStart: 0,
});

export default () => (
	<div css={layoutStyles}>
		<TagGroup label="Simple tags">
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
		</TagGroup>
		<TagGroup label="Link tags">
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
		</TagGroup>
		<TagGroup label="Rounded tags">
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
		</TagGroup>
		<TagGroup label="Removable tags">
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
		</TagGroup>
	</div>
);
