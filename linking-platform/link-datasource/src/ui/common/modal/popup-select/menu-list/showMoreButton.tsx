import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import ButtonOld from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';

import { asyncPopupSelectMessages } from './messages';

type ShowMoreButtonProps = {
	onShowMore: () => void;
	filterName: string;
};

const ShowMoreButton = ({ onShowMore, filterName }: ShowMoreButtonProps) => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const handleShowMore = useCallback(() => {
		fireEvent('ui.button.clicked.basicSearchDropdown', {
			filterName,
			type: 'showMore',
		});

		onShowMore();
	}, [filterName, fireEvent, onShowMore]);

	if (fg('platform-linking-visual-refresh-sllv')) {
		return (
			<Button
				onClick={handleShowMore}
				appearance="subtle"
				testId={`${filterName}--show-more-button`}
				spacing="compact"
			>
				{formatMessage(asyncPopupSelectMessages.showMoreMessage)}
			</Button>
		);
	}

	return (
		<ButtonOld
			onClick={handleShowMore}
			appearance="link"
			testId={`${filterName}--show-more-button`}
		>
			{formatMessage(asyncPopupSelectMessages.showMoreMessage)}
		</ButtonOld>
	);
};

export default ShowMoreButton;
