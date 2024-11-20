/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Tag, { SimpleTag } from '@atlaskit/tag';
import TagGroup from '@atlaskit/tag-group';
import { token } from '@atlaskit/tokens';

const layoutStyles = css({
	display: 'flex',
	padding: `${token('space.300', '24px')} 0`,
	gap: token('space.300', '24px'),
	flexDirection: 'column',
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
