import React from 'react';

import { IntlProvider } from 'react-intl';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '300px',
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
				<form onSubmit={(event) => event.preventDefault()}>
					<label>
						Project name
						<Textfield name="project" defaultValue="Atlas" />
					</label>
					<Button appearance="primary" type="submit">
						Create project
					</Button>
				</form>
			</Box>
		</IntlProvider>
	);
}
