import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '320px',
		height: '130px',
		paddingInlineStart: token('space.300'),
		paddingBlockStart: token('space.300'),
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
				<SpotlightCard placement="bottom-end">
					<SpotlightHeader>
						<SpotlightHeadline>Your team’s new home</SpotlightHeadline>
					</SpotlightHeader>
					<SpotlightBody>Keep projects and updates together.</SpotlightBody>
					<SpotlightFooter>
						<SpotlightActions>
							<SpotlightPrimaryAction>Got it</SpotlightPrimaryAction>
						</SpotlightActions>
					</SpotlightFooter>
				</SpotlightCard>
			</Box>
		</IntlProvider>
	);
}
