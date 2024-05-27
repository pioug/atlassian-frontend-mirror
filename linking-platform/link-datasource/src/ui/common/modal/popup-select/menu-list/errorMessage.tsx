import React, { useEffect } from 'react';

import { useDebouncedCallback } from 'use-debounce';

import ErrorIcon from '@atlaskit/icon/glyph/error';
import { N500 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { useDatasourceAnalyticsEvents } from '../../../../../analytics';
import { type ErrorShownBasicSearchDropdownAttributesType } from '../../../../../analytics/generated/analytics.types';
import { SEARCH_DEBOUNCE_MS } from '../constants';

import { asyncPopupSelectMessages } from './messages';
import CustomSelectMessage from './selectMessage';

const getErrorReasonType = (
  errors?: unknown[],
): ErrorShownBasicSearchDropdownAttributesType['reason'] => {
  const [error] = errors || [];

  if (error instanceof Error) {
    return 'network';
  }

  if (errors && errors.length > 0) {
    return 'agg';
  }

  return 'unknown';
};

const CustomErrorMessage = ({
  filterName,
  errors,
}: {
  filterName: string;
  errors?: unknown[];
}) => {
  const { fireEvent } = useDatasourceAnalyticsEvents();

  /**
   * Debounce is required because our search is debounced
   * ref: ./noOptionsMessage.tsx
   */
  const [debouncedAnalyticsCallback] = useDebouncedCallback(() => {
    fireEvent('ui.error.shown.basicSearchDropdown', {
      filterName,
      reason: getErrorReasonType(errors),
    });
  }, SEARCH_DEBOUNCE_MS);

  useEffect(debouncedAnalyticsCallback, [debouncedAnalyticsCallback]);

  return (
    <CustomSelectMessage
      icon={
        <ErrorIcon
          primaryColor={token('color.icon', N500)}
          label=""
          size="xlarge"
        />
      }
      message={asyncPopupSelectMessages.errorMessage}
      testId={`${filterName}--error-message`}
    />
  );
};

export default CustomErrorMessage;
