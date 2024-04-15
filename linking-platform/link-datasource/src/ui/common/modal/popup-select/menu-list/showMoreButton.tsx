import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';

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

  return (
    <Button
      onClick={handleShowMore}
      appearance="link"
      testId="jlol-basic-filter-popup-select--show-more-button"
    >
      {formatMessage(asyncPopupSelectMessages.showMoreMessage)}
    </Button>
  );
};

export default ShowMoreButton;
