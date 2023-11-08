import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl-next';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

import { messages } from '../../../../../../../messages';
import { getFormattedMessageAsString } from '../../../../../components/utils';
import Text from '../../../../elements/text';
import { ResolvedResultProps } from './types';
import ResolvedResultsStack from './resolved-result-stack';

const RelatedUrlList: React.FC<ResolvedResultProps> = ({
  resolvedResults,
  title,
  renderers,
  testId,
  initializeOpened,
}) => {
  const [isOpen, setIsOpen] = useState(initializeOpened);
  const chevronClickHandler = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const ChevronComponent = isOpen ? ChevronUpIcon : ChevronDownIcon;
  const intl = useIntl();

  return resolvedResults.length > 0 ? (
    <Stack testId={testId} xcss={xcss({ width: '100%' })}>
      <Box
        onClick={chevronClickHandler}
        testId={`${testId}-expand-title`}
        as="button"
        backgroundColor="color.background.neutral.subtle"
        aria-expanded={!!isOpen}
        padding="space.0"
      >
        <Inline alignBlock="center" spread="space-between">
          <Text
            overrideCss={css`
              font-weight: ${token('font.weight.medium', '500')};
            `}
            message={{ descriptor: title }}
          />
          <ChevronComponent
            label={getFormattedMessageAsString(intl, title)}
            size={'medium'}
          />
        </Inline>
      </Box>
      {isOpen && (
        <ResolvedResultsStack
          resolvedResults={resolvedResults}
          testId={testId}
          renderers={renderers}
        />
      )}
    </Stack>
  ) : (
    <Text
      testId={testId}
      message={{ descriptor: messages.related_work_items_not_found }}
    />
  );
};

export default RelatedUrlList;
