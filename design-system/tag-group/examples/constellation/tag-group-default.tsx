/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Tag, { SimpleTag } from '@atlaskit/tag';
import { token } from '@atlaskit/tokens';

import TagGroup from '../../src';

const layoutStyles = css({
	display: 'flex',
	padding: `${token('space.300', '24px')} 0`,
	gap: token('space.300', '24px'),
	flexDirection: 'column',
});

export default () => (
	<div css={layoutStyles}>
		<TagGroup>
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
			<SimpleTag text="Tag" />
		</TagGroup>
		<TagGroup>
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
			<SimpleTag text="Tag link" href="/components/tag-group" />
		</TagGroup>
		<TagGroup>
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
			<SimpleTag text="Rounded tag" appearance="rounded" />
		</TagGroup>
		<TagGroup>
			<Tag text="Removable tag" removeButtonLabel="Remove" />
			<Tag text="Removable tag" removeButtonLabel="Remove" />
			<Tag text="Removable tag" removeButtonLabel="Remove" />
			<Tag text="Removable tag" removeButtonLabel="Remove" />
		</TagGroup>
	</div>
);
