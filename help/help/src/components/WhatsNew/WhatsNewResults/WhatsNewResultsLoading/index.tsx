import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl-next';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';

import { LoadingRectangle } from '../../../../util/styled';

import {
  LoadignWhatsNewResultsList,
  LoadignWhatsNewResultsListItem,
} from './styled';

import { WhatsNewResultsListTitleContainer } from '../styled';

export const WhatsNewResultsLoading: React.FC<WrappedComponentProps> = ({
  intl: { formatMessage },
}) => {
  return (
    <>
      <LoadingRectangle
        contentHeight={`${gridSize() * 5}px`}
        contentWidth="152px"
        marginTop="0"
      />
      <LoadignWhatsNewResultsList
        aria-label={formatMessage(messages.help_loading)}
        role="img"
      >
        <WhatsNewResultsListTitleContainer>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
        </WhatsNewResultsListTitleContainer>

        <LoadignWhatsNewResultsListItem>
          <LoadingRectangle
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              position: 'relative',
            }}
            contentHeight="16px"
            contentWidth="16px"
            marginTop="4px"
          />
          <LoadingRectangle
            style={{
              marginLeft: token('space.100', '8px'),
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>

        <LoadignWhatsNewResultsListItem>
          <LoadingRectangle
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              position: 'relative',
            }}
            contentHeight="16px"
            contentWidth="16px"
            marginTop="4px"
          />
          <LoadingRectangle
            style={{
              marginLeft: token('space.100', '8px'),
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>

        <WhatsNewResultsListTitleContainer>
          <LoadingRectangle
            contentHeight="11px"
            contentWidth="60px"
            marginTop="0"
          />
        </WhatsNewResultsListTitleContainer>

        <LoadignWhatsNewResultsListItem>
          <LoadingRectangle
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              position: 'relative',
            }}
            contentHeight="16px"
            contentWidth="16px"
            marginTop="4px"
          />
          <LoadingRectangle
            style={{
              marginLeft: token('space.100', '8px'),
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>

        <LoadignWhatsNewResultsListItem>
          <LoadingRectangle
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              position: 'relative',
            }}
            contentHeight="16px"
            contentWidth="16px"
            marginTop="4px"
          />
          <LoadingRectangle
            style={{
              marginLeft: token('space.100', '8px'),
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>
      </LoadignWhatsNewResultsList>
    </>
  );
};

export default injectIntl(WhatsNewResultsLoading);
