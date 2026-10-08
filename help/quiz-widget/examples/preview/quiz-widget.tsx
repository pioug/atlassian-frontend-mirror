import React from 'react';

import { IntlProvider } from 'react-intl';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { QuizWidget } from '@atlaskit/quiz-widget';
import { token } from '@atlaskit/tokens';
const styles = cssMap({
	subject: {
		width: '360px',
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
				<QuizWidget
					quizContent={{
						name: 'Project basics',
						questions: { 1: 'Who can view a private project?' },
						answers: { 1: ['Only invited people', 'Everyone'] },
					}}
					score={null}
					correctAnswers={null}
					onSubmitButtonClick={() => {}}
				/>
			</Box>
		</IntlProvider>
	);
}
