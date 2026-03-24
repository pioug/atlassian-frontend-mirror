import React, { useContext } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { pasteOptionsToolbarMessages as messages } from '@atlaskit/editor-common/messages';
import { OutsideClickTargetRefContext } from '@atlaskit/editor-common/ui-react';
import { ToolbarDropdownItemSection } from '@atlaskit/editor-toolbar';
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

interface PasteActionsMenuContentProps {
	components: RegisterComponent[];
	onMouseDown: (e: React.MouseEvent) => void;
	onMouseEnter: () => void;
}

export const PasteActionsMenuContent = ({
	onMouseDown,
	onMouseEnter,
	components,
}: PasteActionsMenuContentProps): React.JSX.Element => {
	const setOutsideClickTargetRef = useContext(OutsideClickTargetRefContext);
	const intl = useIntl();

	return (
		<Box
			ref={setOutsideClickTargetRef}
			xcss={styles.container}
			onMouseDown={onMouseDown}
			onMouseEnter={onMouseEnter}
		>
			<ToolbarDropdownItemSection title={intl.formatMessage(messages.pasteMenuActionsTitle)}>
				{/* eslint-disable-next-line @atlassian/perf-linting/no-unstable-inline-props -- Ignored via go/ees017 (to be fixed) */}
				<SurfaceRenderer surface={{ type: 'menu', key: 'paste-menu' }} components={components} />
			</ToolbarDropdownItemSection>
		</Box>
	);
};
