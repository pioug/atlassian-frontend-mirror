import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button/new';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';

import { asyncPopupSelectMessages } from './messages';

type ShowMoreButtonProps = {
	filterLabel?: string;
	filterName: string;
	onShowMore: () => void;
};

const ShowMoreButton = ({
	onShowMore,
	filterName,
	filterLabel = '',
}: ShowMoreButtonProps): React.JSX.Element => {
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
			aria-label={filterLabel ? `Show more ${filterLabel}` : 'Show more'}
		>
			{formatMessage(asyncPopupSelectMessages.showMoreMessage)}
		</Button>
	);
};

export default ShowMoreButton;
