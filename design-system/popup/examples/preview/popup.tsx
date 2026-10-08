import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { Popup } from '@atlaskit/popup/popup';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	trigger: { visibility: 'hidden' },
	subject: {
		width: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<Popup
					isOpen
					label="Share with your team"
					role="dialog"
					placement="bottom-start"
					shouldRenderToParent
					content={() => <Box padding="space.200">Share this project with your team.</Box>}
					trigger={(triggerProps) => (
						<Box xcss={styles.trigger}>
							<Button {...triggerProps} isSelected>
								Share
							</Button>
						</Box>
					)}
				/>
			</Box>
		</IntlProvider>
	);
}
