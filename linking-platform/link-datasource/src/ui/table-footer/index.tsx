/** @jsx jsx */
import { Fragment, useEffect, useState } from 'react';

import { jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import RefreshIcon from '@atlaskit/icon/glyph/refresh';
import LinkUrl from '@atlaskit/smart-card/link-url';
import { N0, N40, N800, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { footerMessages } from './messages';
import { SyncInfo } from './sync-info';

export type TableFooterProps = {
  itemCount?: number;
  onRefresh?: () => void;
  isLoading: boolean;
  url?: string;
};

const FooterWrapper = styled.div`
  padding: 0 ${token('space.200', '16px')};
  box-sizing: border-box;
  border-radius: inherit;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background: ${token('color.background.input', N0)};
  border-top: 2px solid ${token('color.background.accent.gray.subtler', N40)};
`;

const TopBorderWrapper = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  padding: ${token('space.250', '20px')} 0;
`;

const ItemCounterWrapper = styled.div`
  display: flex;
  align-self: center;
`;

const SyncWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${token('color.text.accent.gray', N90)};
`;

const SyncTextWrapper = styled.div`
  margin-right: 5px;
  font-size: 12px;
`;

export const TableFooter = ({
  itemCount,
  onRefresh,
  isLoading,
  url,
}: TableFooterProps) => {
  const intl = useIntl();
  const [lastSyncTime, setLastSyncTime] = useState(new Date());

  const showItemCount =
    itemCount && itemCount > 0 ? true : itemCount === 0 ? !isLoading : false;

  useEffect(() => {
    if (isLoading) {
      setLastSyncTime(new Date());
    }
  }, [isLoading]);

  // If only one of the two is passed in, still show the other one (Note: We keep the div encapsulating the one not shown to
  // ensure correct positioning since 'justify-content: space-between' is used).
  return onRefresh || showItemCount ? (
    <FooterWrapper data-testid="table-footer">
      <TopBorderWrapper>
        <ItemCounterWrapper data-testid="item-count-wrapper">
          {showItemCount && (
            <LinkUrl
              href={url}
              target="_blank"
              testId="item-count-url"
              style={{
                color: token('color.text.accent.gray', N800),
                textDecoration: !url ? 'none' : '',
              }}
            >
              <Heading testId="item-count" level="h200">
                <FormattedNumber value={itemCount as number} />{' '}
                <FormattedMessage
                  {...footerMessages.itemText}
                  values={{ itemCount }}
                />
              </Heading>
            </LinkUrl>
          )}
        </ItemCounterWrapper>
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
