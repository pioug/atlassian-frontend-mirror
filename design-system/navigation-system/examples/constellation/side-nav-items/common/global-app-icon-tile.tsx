/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import type { LogoProps } from '@atlaskit/logo';
import { token } from '@atlaskit/tokens';

type GlobalAppIconTileProps = {
	logo: React.ComponentType<LogoProps>;
};

const styles = cssMap({
	root: {
		backgroundColor: token('color.background.brand.bold'),
		borderRadius: token('radius.small'),
		width: 20,
		height: 20,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		// Creates a 24px bounding box
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginBlockEnd: token('space.025'),
		marginInlineStart: token('space.025'),
	},
});

/**
 * This is an idea for what a platform component could look like for global app icon tiles.
 *
 * Intentionally not exported, just using it for an example at the moment.
 */
export function GlobalAppIconTile({ logo: Logo }: GlobalAppIconTileProps): JSX.Element {
	return (
		<div css={styles.root}>
			<Logo size="xxsmall" label="" appearance="inverse" />
		</div>
	);
}
