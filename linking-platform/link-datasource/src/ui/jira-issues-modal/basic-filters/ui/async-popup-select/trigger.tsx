import React, { forwardRef, useCallback } from 'react';

import styled from '@emotion/styled';
import { FormattedMessage } from 'react-intl-next';

import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button/standard-button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { Box, Flex, xcss } from '@atlaskit/primitives';
import Spinner from '@atlaskit/spinner';

import { BasicFilterFieldType, SelectOption } from '../../types';

import { asyncPopupSelectMessages } from './messages';

export interface PopupTriggerProps {
  filterType: BasicFilterFieldType;
  selectedOptions?: ReadonlyArray<SelectOption>;
  isSelected?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
}

const triggerButtonLabelStyles = xcss({
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '150px',
});

const badgeStyles = xcss({
  marginLeft: 'space.050',
});

export const LoadingStateAnimationWrapper = styled.div({
  position: 'relative',
  animation: 'flickerAnimation 2s infinite',
  '@keyframes flickerAnimation': {
    '0%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
    '100%': {
      opacity: 1,
    },
  },
});

const PopupTrigger = forwardRef<HTMLElement, PopupTriggerProps>(
  ({ filterType, isSelected, isDisabled, isLoading, selectedOptions }, ref) => {
    const [firstOption] = selectedOptions || [];

    const hasOptions = selectedOptions && selectedOptions.length > 0;
    const showButtonLoading = !isDisabled && isLoading;
    const testId = `jlol-basic-filter-${filterType}-trigger`;

    const LoadingButton = useCallback(
      () => (
        <LoadingStateAnimationWrapper>
          <Button
            iconAfter={<Spinner size={'xsmall'} />}
            testId={`${testId}--loading-button`}
          >
            <FormattedMessage
              {...asyncPopupSelectMessages[`${filterType}Label`]}
            />
          </Button>
        </LoadingStateAnimationWrapper>
      ),
      [filterType, testId],
    );

    const DefaultButton = useCallback(
      () => (
        <Button
          appearance="default"
          isSelected={isSelected || hasOptions}
          isDisabled={isDisabled}
          iconAfter={<ChevronDownIcon label="" />}
          testId={`${testId}--button`}
        >
          <Flex>
            <Box xcss={triggerButtonLabelStyles}>
              <FormattedMessage
                {...asyncPopupSelectMessages[`${filterType}Label`]}
              />
              {firstOption && <>: {firstOption.label}</>}
            </Box>
            {selectedOptions && selectedOptions.length > 1 && (
              <Flex xcss={badgeStyles} alignItems="center">
                <Badge appearance="primary">
                  +{selectedOptions.length - 1}
                </Badge>
              </Flex>
            )}
          </Flex>
        </Button>
      ),
      [
        filterType,
        firstOption,
        hasOptions,
        isDisabled,
        isSelected,
        selectedOptions,
        testId,
      ],
    );

    /**
     * We had an issue with the popup component referencing a stale DOM ref for the trigger button.
     * Hence introducing a Box to make sure ref is always the same and only content is refreshed on re-renders
     */
    return (
      <Box ref={ref} testId={testId}>
        {showButtonLoading ? <LoadingButton /> : <DefaultButton />}
      </Box>
    );
  },
);

export default PopupTrigger;
