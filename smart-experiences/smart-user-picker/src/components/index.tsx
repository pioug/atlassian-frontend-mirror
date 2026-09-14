import React from 'react';

import { UfoErrorBoundary } from '../UfoErrorBoundary';
import type { Props } from '../types';
import { smartUserPickerRenderedUfoExperience } from '../ufoExperiences';
import { useUFOConcurrentExperience } from '../useUFOConcurrentExperience';
import MessagesIntlProvider from './MessagesIntlProvider';
import { SmartUserPicker } from './SmartUserPicker';

const SmartUserPickerWithIntlProvider: React.FunctionComponent<Props> = (props) => {
	const ufoId = props.inputId || props.fieldId;
	useUFOConcurrentExperience(smartUserPickerRenderedUfoExperience, ufoId);
	return (
		<UfoErrorBoundary id={ufoId}>
			<MessagesIntlProvider>
				<SmartUserPicker {...props} />
			</MessagesIntlProvider>
		</UfoErrorBoundary>
	);
};

export default SmartUserPickerWithIntlProvider;
