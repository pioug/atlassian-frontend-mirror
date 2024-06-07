import React from 'react';
import { FormattedMessage } from 'react-intl-next';
import { Box } from '@atlaskit/primitives';

import { messages } from '../../../../../../messages';
import AIIconLoading from '../../../../../common/ai-icon-loading';
import AIIndicatorContainer from './ai-indicator-container';
import { type AIStateIndicatorProps } from './types';

const AIStateLoading: React.FC<Partial<AIStateIndicatorProps>> = ({ appearance, testId }) => {
	switch (appearance) {
		case 'icon-only':
			return null;
		default:
			return (
				<AIIndicatorContainer
					icon={<AIIconLoading label="AI" size="small" testId={`${testId}-loading-icon`} />}
					content={
						<Box testId={`${testId}-loading-message`}>
							<FormattedMessage {...messages.ai_summarizing} />
						</Box>
					}
					testId={`${testId}-loading`}
				/>
			);
	}
};

export default AIStateLoading;
