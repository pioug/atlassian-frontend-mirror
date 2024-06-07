import React from 'react';

import Spinner from '@atlaskit/spinner';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const CustomDropdownLoadingMessage = ({ filterName }: { filterName: string }) => {
	return (
		<CustomSelectMessage
			icon={<Spinner size="large" />}
			message={asyncPopupSelectMessages.loadingMessage}
			testId={`${filterName}--loading-message`}
		/>
	);
};

export default CustomDropdownLoadingMessage;
