import React from 'react';

import { IntlProvider } from 'react-intl';

import { ContextualSurvey } from '@atlaskit/contextual-survey/new';
import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '400px',
		display: 'block',
		transform: 'translateX(0)',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.200'),
	},
});

export default function Preview(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Box testId="component-preview" xcss={styles.subject}>
				<ContextualSurvey
					question="How was your experience?"
					onDismiss={() => {}}
					scoreSubtext={['Not great', 'Neutral', 'Excellent']}
					getUserHasAnsweredMailingList={async () => true}
					onMailingListAnswer={async () => {}}
					onSubmit={async () => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
