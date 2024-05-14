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

import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';

import { footerMessages } from './messages';
import { PoweredByJSMAssets } from './powered-by-jsm-assets';
import { SyncInfo } from './sync-info';

export type TableFooterProps = {
  datasourceId: string;
  itemCount?: number;
  onRefresh?: () => void;
  isLoading: boolean;
  url?: string;
};

const FooterWrapper = styled.div({
  padding: `${token('space.0', '0px')} ${token('space.200', '16px')}`,
  boxSizing: 'border-box',
  borderRadius: 'inherit',
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  background: token('color.background.input', N0),
  borderTop: `2px solid ${token('color.background.accent.gray.subtler', N40)}`,
});

const TopBorderWrapper = styled.div({
  display: 'flex',
  boxSizing: 'border-box',
  justifyContent: 'space-between',
  padding: `${token('space.250', '20px')} ${token('space.0', '0px')}`,
});

const ItemCounterWrapper = styled.div({
  display: 'flex',
  alignSelf: 'center',
});

const SyncWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  color: token('color.text.accent.gray', N90),
});

const SyncTextWrapper = styled.div({
  marginRight: token('space.075', '6px'),
  fontSize: '12px',
});

export const TableFooter = ({
  datasourceId,
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
        {datasourceId === ASSETS_LIST_OF_LINKS_DATASOURCE_ID ? (
          <PoweredByJSMAssets
            text={intl.formatMessage(footerMessages.powerByJSM)}
          />
        ) : null}

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
