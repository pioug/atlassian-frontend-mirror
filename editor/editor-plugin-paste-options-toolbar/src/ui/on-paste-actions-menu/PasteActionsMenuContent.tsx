import React, { useCallback, useContext } from 'react';

import { cssMap } from '@atlaskit/css';
import { PASTE_MENU } from '@atlaskit/editor-common/toolbar';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import type { RegisterComponent } from '@atlaskit/editor-ui-control-model';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
	},
});

const pasteMenuSurface = { type: PASTE_MENU.type, key: PASTE_MENU.key } as const;

interface PasteActionsMenuContentProps {
	components: RegisterComponent[];
	contentRef?: React.RefObject<HTMLDivElement | null>;
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
}

export const PasteActionsMenuContent = ({
	onMouseDown,
	onMouseEnter,
	components,
	contentRef,
}: PasteActionsMenuContentProps): React.JSX.Element => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	const mergedRef = useCallback(
		(node: HTMLDivElement | null) => {
			setOutsideClickTargetRef?.(node);
			if (contentRef) {
				(contentRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
			}
		},
		[setOutsideClickTargetRef, contentRef],
	);

	return (
		<Box
			ref={mergedRef}
			xcss={styles.container}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
		>
			<SurfaceRenderer surface={pasteMenuSurface} components={components} />
		</Box>
	);
};
