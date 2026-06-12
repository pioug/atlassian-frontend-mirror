/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { Main } from '@atlaskit/navigation-system/layout/main';
import { Root } from '@atlaskit/navigation-system/layout/root';
import { token } from '@atlaskit/tokens';
import { Dialog } from '@atlaskit/top-layer/dialog';

const styles = cssMap({
	mainContent: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	dialogContent: {
		width: '320px',
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
		backgroundColor: token('elevation.surface.overlay'),
		borderRadius: token('radius.large'),
		boxShadow: token('elevation.shadow.overlay'),
	},
});

// Native <dialog> as a direct child of Root must still be promoted into the top layer.
export default function PageLayoutTopLayerDialogAsDirectChildExample(): JSX.Element {
	const [isOpen, setIsOpen] = useState(true);

	const handleClose = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<Root>
			<Main>
				<div css={styles.mainContent}>main content</div>
			</Main>
			<Dialog isOpen={isOpen} onClose={handleClose} label="Top-layer dialog as direct child">
				<div css={styles.dialogContent}>Top-layer dialog content</div>
			</Dialog>
		</Root>
	);
}
