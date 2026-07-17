/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import Tag from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';
import { token } from '@atlaskit/tokens';

const layoutStyles = css({
	display: 'flex',
	gap: token('space.300'),
	flexDirection: 'column',
	paddingBlockEnd: token('space.300'),
	paddingBlockStart: token('space.300'),
	paddingInlineEnd: 0,
	paddingInlineStart: 0,
});

const _default: () => JSX.Element = () => (
	<div css={layoutStyles}>
		<TagGroup label="Simple tags">
			<Tag text="Tag" isRemovable={false} />
			<Tag text="Tag" isRemovable={false} />
			<Tag text="Tag" isRemovable={false} />
			<Tag text="Tag" isRemovable={false} />
		</TagGroup>
		<TagGroup label="Link tags">
			<Tag text="Tag link" href="/components/tag-group" isRemovable={false} />
			<Tag text="Tag link" href="/components/tag-group" isRemovable={false} />
			<Tag text="Tag link" href="/components/tag-group" isRemovable={false} />
			<Tag text="Tag link" href="/components/tag-group" isRemovable={false} />
		</TagGroup>
		<TagGroup label="Rounded tags">
			<Tag text="Rounded tag" appearance="rounded" isRemovable={false} />
			<Tag text="Rounded tag" appearance="rounded" isRemovable={false} />
			<Tag text="Rounded tag" appearance="rounded" isRemovable={false} />
			<Tag text="Rounded tag" appearance="rounded" isRemovable={false} />
		</TagGroup>
		<TagGroup label="Removable tags">
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
			<Tag text="Removable tag" />
		</TagGroup>
	</div>
);
export default _default;
