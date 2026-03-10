import React, { useContext } from 'react';

import { cssMap } from '@atlaskit/css';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import { SurfaceRenderer } from '@atlaskit/editor-ui-control-model';
import type { RegisterComponent, SurfaceIdentifier } from '@atlaskit/editor-ui-control-model';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	container: {
		backgroundColor: token('elevation.surface.overlay'),
		boxShadow: token('elevation.shadow.overlay'),
		borderRadius: token('radius.small'),
		paddingBlock: token('space.050'),
	},
});

interface PasteActionsMenuContentProps {
	aiSurface?: SurfaceIdentifier;
	aiSurfaceComponents?: RegisterComponent[];
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
	pasteSurfaceComponents?: RegisterComponent[];
}

export const PasteActionsMenuContent = ({
	onMouseDown,
	onMouseEnter,
	aiSurface,
	aiSurfaceComponents,
	pasteSurfaceComponents,
}: PasteActionsMenuContentProps) => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);

	return (
		<Box
			ref={setOutsideClickTargetRef}
			xcss={styles.container}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
		>
			{aiSurface && aiSurfaceComponents && aiSurfaceComponents.length > 0 && (
				<SurfaceRenderer surface={aiSurface} components={aiSurfaceComponents} />
			)}
			{pasteSurfaceComponents && pasteSurfaceComponents.length > 0 && (
				<SurfaceRenderer
					surface={{ type: 'menu', key: 'paste-menu' }}
					components={pasteSurfaceComponents}
				/>
			)}
		</Box>
	);
};
