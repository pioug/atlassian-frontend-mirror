/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import RefreshIcon from '@atlaskit/icon/core/migration/refresh';
import { Flex } from '@atlaskit/primitives';
import { N0, N40, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';
import TableSearchCount, { AssetsItemCount } from '../common/modal/search-count';

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

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const FooterWrapper = styled.div({
	padding: `${token('space.0', '0px')} ${token('space.200', '16px')}`,
	boxSizing: 'border-box',
	borderRadius: 'inherit',
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	background: token('color.background.input', N0),
	borderTop: `2px solid ${token('color.background.accent.gray.subtler', N40)}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TopBorderWrapper = styled.div({
	display: 'flex',
	boxSizing: 'border-box',
	justifyContent: 'space-between',
	padding: `${token('space.250', '20px')} ${token('space.0', '0px')}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SyncWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	color: token('color.text.accent.gray', N90),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
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

	const showItemCount = itemCount && itemCount > 0 ? true : itemCount === 0 ? !isLoading : false;

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
				{showItemCount && (
					<Flex>
						{datasourceId === ASSETS_LIST_OF_LINKS_DATASOURCE_ID ? (
							<AssetsItemCount searchCount={itemCount as number} url={url} testId="item-count" />
						) : (
							<TableSearchCount
								searchCount={itemCount as number}
								url={url}
								prefixTextType="item"
								testId="item-count"
							/>
						)}
					</Flex>
				)}
				{datasourceId === ASSETS_LIST_OF_LINKS_DATASOURCE_ID ? (
					<PoweredByJSMAssets text={intl.formatMessage(footerMessages.powerByJSM)} />
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
										color="currentColor"
										spacing="spacious"
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
