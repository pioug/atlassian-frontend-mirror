/** @jsx jsx */

import { useMemo } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, MessageDescriptor } from 'react-intl-next';

import Lozenge from '@atlaskit/lozenge';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { JiraSearchMethod } from '../../../common/types';

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
  width: '260px',
});

const betaTagStyles = css({
  display: 'flex',
});

const searchTitleStyles = css({
  color: token('color.text.subtlest', N300),
  fontWeight: token('font.weight.medium', '500'),
  fontSize: token('font.size.300', '20px'),
  lineHeight: token('font.lineHeight.300', '24px'),
  paddingTop: token('space.200', '16px'),
  paddingBottom: token('space.100', '8px'),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: token('space.100', '8px'),
});

const mainTextStyles = css({
  color: token('color.text.subtlest', N300),
});

const learnMoreLinkStyles = css({
  paddingTop: token('space.200', '16px'),
  display: 'inline-block',
});

interface InitialStateViewProps {
  searchMethod: JiraSearchMethod;
}

const methodToDescriptionMessage: Record<JiraSearchMethod, MessageDescriptor> =
  {
    basic: initialStateViewMessages.searchDescriptionForBasicSearch,
    jql: initialStateViewMessages.searchDescriptionForJQLSearch,
  };

const jqlSupportDocumentLink =
  'https://support.atlassian.com/jira-service-management-cloud/docs/use-advanced-search-with-jira-query-language-jql/';

export const InitialStateView = ({ searchMethod }: InitialStateViewProps) => {
  const showBasicFilters = useMemo(() => {
    if (
      getBooleanFF(
        'platform.linking-platform.datasource.show-jlol-basic-filters',
      )
    ) {
      return true;
    }
    return false;
  }, []);

  return (
    <div
      css={initialStateViewContainerStyles}
      data-testid="jlol-datasource-modal--initial-state-view"
    >
      <div css={svgAndTextsWrapperStyles}>
        <InitialStateSVG />
        <div css={searchTitleStyles}>
          {!showBasicFilters && (
            <div css={betaTagStyles}>
              <Lozenge appearance="new">
                <FormattedMessage {...initialStateViewMessages.beta} />
              </Lozenge>
            </div>
          )}
          <FormattedMessage {...initialStateViewMessages.searchTitle} />
        </div>
        <div css={mainTextStyles}>
          <FormattedMessage {...methodToDescriptionMessage[searchMethod]} />
        </div>
        {searchMethod === 'jql' ? (
          <a
            href={jqlSupportDocumentLink}
            target="_blank"
            css={learnMoreLinkStyles}
          >
            <FormattedMessage {...initialStateViewMessages.learnMoreLink} />
          </a>
        ) : null}
      </div>
    </div>
  );
};
