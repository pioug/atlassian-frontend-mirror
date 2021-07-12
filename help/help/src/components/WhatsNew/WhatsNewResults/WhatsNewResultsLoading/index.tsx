import React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { gridSize } from '@atlaskit/theme/constants';

import { messages } from '../../../../messages';

import { LoadingRectangle, LoadingCircle } from '../../../../util/styled';

import {
  LoadignWhatsNewResultsList,
  LoadignWhatsNewResultsListItem,
} from './styled';

import { WhatsNewResultsListTitleContainer } from '../styled';

export const WhatsNewResultsLoading: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  return (
    <>
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
          <LoadingCircle />
          <LoadingRectangle
            style={{
              marginLeft: `${gridSize()}px`,
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>

        <LoadignWhatsNewResultsListItem>
          <LoadingCircle />
          <LoadingRectangle
            style={{
              marginLeft: `${gridSize()}px`,
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
          <LoadingCircle />
          <LoadingRectangle
            style={{
              marginLeft: `${gridSize()}px`,
            }}
            contentHeight="11px"
            contentWidth="60px"
            marginTop="4px"
          />
          <LoadingRectangle contentWidth="100%" marginTop="8px" />
          <LoadingRectangle contentWidth="90%" marginTop="4px" />
        </LoadignWhatsNewResultsListItem>

        <LoadignWhatsNewResultsListItem>
          <LoadingCircle />
          <LoadingRectangle
            style={{
              marginLeft: `${gridSize()}px`,
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
