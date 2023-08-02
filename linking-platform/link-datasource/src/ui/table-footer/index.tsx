/** @jsx jsx */
import { Fragment, useEffect, useState } from 'react';

import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import { N0, N40, N800, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { footerMessages } from './messages';
import { SyncInfo } from './sync-info';

export type TableFooterProps = {
  issueCount?: number;
  onRefresh?: () => void;
  isLoading: boolean;
};

const FooterWrapper = styled.div`
  padding: 0 ${token('space.200', '16px')};
  box-sizing: border-box;
  background: ${token('color.background.input', N0)};
`;

const TopBorderWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: ${token('space.250', '20px')} 0;
  border-top: 2px solid ${token('color.background.accent.gray.subtler', N40)};
`;

const IssueCounterWrapper = styled.div`
  display: flex;
  align-self: center;
  color: ${token('color.text.accent.gray', N800)};
`;

const SyncWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${token('color.text.accent.gray', N90)};
`;

const SyncTextWrapper = styled.div`
  margin-right: 5px;
`;

export const TableFooter = ({
  issueCount,
  onRefresh,
  isLoading,
}: TableFooterProps) => {
  const intl = useIntl();
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const showIssueCount =
    issueCount && issueCount > 0 ? true : issueCount === 0 ? !isLoading : false;

  useEffect(() => {
    if (isLoading) {
      setLastSyncTime(new Date());
    }
  }, [isLoading]);

  // If only one of the two is passed in, still show the other one (Note: We keep the div encapsulating the one not shown to
  // ensure correct positioning since 'justify-content: space-between' is used).
  return onRefresh || showIssueCount ? (
    <FooterWrapper data-testid="table-footer">
      <TopBorderWrapper>
        <IssueCounterWrapper data-testid={'issue-count-wrapper'}>
          {showIssueCount && (
            <Heading testId="issue-count" level="h400">
              <FormattedNumber value={issueCount as number} />{' '}
              <FormattedMessage
                {...footerMessages.issueText}
                values={{ issueCount }}
              />
            </Heading>
          )}
        </IssueCounterWrapper>
        <SyncWrapper>
          {onRefresh && (
            <Fragment>
              <SyncTextWrapper data-testid="sync-text">
                {isLoading ? (
                  <FormattedMessage {...footerMessages.loadingText} />
                ) : (
                  <SyncInfo lastSyncTime={lastSyncTime} />
                )}
              </SyncTextWrapper>
              <Button
                onClick={onRefresh}
                appearance="subtle"
                iconBefore={
                  <RefreshIcon
                    label={intl.formatMessage(footerMessages.refreshLabel)}
                  />
                }
                isDisabled={isLoading}
                testId="refresh-button"
              />
            </Fragment>
          )}
        </SyncWrapper>
      </TopBorderWrapper>
    </FooterWrapper>
  ) : null;
};
