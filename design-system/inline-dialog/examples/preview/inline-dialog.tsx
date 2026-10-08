import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import InlineDialog from '@atlaskit/inline-dialog/inline-dialog';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '360px',
		height: '160px',
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
				<InlineDialog
					testId="access-dialog"
					isOpen
					content={<Box>Only your team can access this project.</Box>}
				>
					<Button testId="preview-access-trigger">Team access</Button>
				</InlineDialog>
			</Box>
		</IntlProvider>
	);
}

export const previewOptions = {
	width: 360,
	readySelector: '[data-testid=access-dialog]',
	subjectSelector: '[data-testid=access-dialog]',
	hiddenTriggerSelector: '[data-testid=preview-access-trigger]',
};
