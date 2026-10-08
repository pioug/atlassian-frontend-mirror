import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import HelpLayout from '@atlaskit/help-layout/HelpLayout';
import { Box } from '@atlaskit/primitives/compiled/box';
import { RightSidePanel } from '@atlaskit/right-side-panel/RightSidePanel';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	panel: { width: '340px', height: '220px', transform: 'translateX(0)' },
	subject: {
		width: '340px',
		display: 'block',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Box id="preview-panel-target" xcss={styles.panel}>
					<RightSidePanel
						isOpen
						skipAnimationOnMount
						attachPanelTo="preview-panel-target"
						width={340}
					>
						<HelpLayout headerTitle="Project help">
							<Box padding="space.200">Invite your team to collaborate on your project.</Box>
						</HelpLayout>
					</RightSidePanel>
				</Box>
			</Box>
		</IntlProvider>
	);
}
