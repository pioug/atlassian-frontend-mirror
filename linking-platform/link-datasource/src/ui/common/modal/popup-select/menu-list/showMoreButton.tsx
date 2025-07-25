import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import { fg } from '@atlaskit/platform-feature-flags';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';

import { asyncPopupSelectMessages } from './messages';

type ShowMoreButtonProps = {
	onShowMore: () => void;
	filterName: string;
	filterLabel?: string;
};

const ShowMoreButton = ({ onShowMore, filterName, filterLabel = '' }: ShowMoreButtonProps) => {
	const { formatMessage } = useIntl();
	const { fireEvent } = useDatasourceAnalyticsEvents();

	const handleShowMore = useCallback(() => {
		fireEvent('ui.button.clicked.basicSearchDropdown', {
			filterName,
			type: 'showMore',
		});

		onShowMore();
	}, [filterName, fireEvent, onShowMore]);

	return (
		<Button
			onClick={handleShowMore}
			appearance="subtle"
			testId={`${filterName}--show-more-button`}
			spacing="compact"
			{...(fg('platform-linking-sllv-show-more-aria-label')
				? {
						'aria-label': filterLabel ? `Show more ${filterLabel}` : 'Show more',
					}
				: {})}
		>
			{formatMessage(asyncPopupSelectMessages.showMoreMessage)}
		</Button>
	);
};

export default ShowMoreButton;
