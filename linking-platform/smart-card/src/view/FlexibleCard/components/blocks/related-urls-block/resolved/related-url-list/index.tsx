import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl-next';

import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import { Box, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { css } from '@emotion/react';

import { messages } from '../../../../../../../messages';
import { getFormattedMessageAsString } from '../../../../../components/utils';
import Text from '../../../../elements/text';
import RelatedUrlItem from './related-url-item';
import { ResolvedResultProps } from './types';

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

  const resolvedResultsStack = useMemo(() => {
    return (
      <Stack space="space.050" testId={`${testId}-items-wrapper`}>
        {resolvedResults.map((resolvedResults, idx) => (
          <RelatedUrlItem
            testId={`${testId}-item`}
            key={idx}
            results={resolvedResults}
            renderers={renderers}
          />
        ))}
      </Stack>
    );
  }, [renderers, resolvedResults, testId]);

  return resolvedResults.length > 0 ? (
    <Stack testId={testId} xcss={xcss({ width: '100%' })}>
      <Box onClick={chevronClickHandler} testId={`${testId}-expand-title`}>
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
      {isOpen && resolvedResultsStack}
    </Stack>
  ) : (
    <Text
      testId={testId}
      message={{ descriptor: messages.related_work_items_not_found }}
    />
  );
};

export default RelatedUrlList;
