/** @jsx jsx */

import { css, jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { token } from '@atlaskit/tokens';

import { InitialStateSVG } from './assets/initial-state-svg';
import { initialStateViewMessages } from './messages';

const initialStateViewContainerStyles = css({
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
});
const svgAndTextsWrapperStyles = css({
  textAlign: 'center',
  alignSelf: 'center',
  paddingTop: token('space.600', '48px'),
  paddingBottom: token('space.600', '48px'),
});
const searchTitleStyles = css({
  fontWeight: token('font.weight.semibold', '600'),
  fontSize: token('font.size.200', '16px'),
  lineHeight: token('font.lineHeight.300', '24px'),
  paddingTop: token('space.200', '16px'),
  paddingBottom: token('space.100', '8px'),
});

const jqlSupportDocumentLink =
  'https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/';

export const InitialStateView = () => {
  const { formatMessage } = useIntl();

  return (
    <div
      css={initialStateViewContainerStyles}
      data-testid="jlol-datasource-modal--initial-state-view"
    >
      <div css={svgAndTextsWrapperStyles}>
        <InitialStateSVG />
        <div css={searchTitleStyles}>
          {formatMessage(initialStateViewMessages.searchTitle)}
        </div>
        <div>{formatMessage(initialStateViewMessages.searchDescription)}</div>
        <a href={jqlSupportDocumentLink} target="_blank">
          {formatMessage(initialStateViewMessages.learnMoreLink)}
        </a>
      </div>
    </div>
  );
};
