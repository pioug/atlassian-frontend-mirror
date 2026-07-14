/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@compiled/react';

import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { token } from '@atlaskit/tokens';
import { Popover } from '@atlaskit/top-layer/popover';

const styles = cssMap({
	mainContent: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	popoverContent: {
		width: '240px',
		backgroundColor: token('elevation.surface.overlay'),
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

// A [popover] element as a direct child of Root must still be promoted into the top layer.
export default function PageLayoutTopLayerPopoverAsDirectChildExample(): JSX.Element {
	return (
		<Root>
			<Main>
				<div css={styles.mainContent}>main content</div>
			</Main>
			<Popover isOpen role="dialog" label="Top-layer popover as direct child" mode="manual">
				<div css={styles.popoverContent}>Top-layer popover content</div>
			</Popover>
		</Root>
	);
}
