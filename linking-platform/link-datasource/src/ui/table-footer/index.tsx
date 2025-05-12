/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useEffect, useState } from 'react';

import { cssMap, jsx, styled } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import { IconButton } from '@atlaskit/button/new';
import RefreshIcon from '@atlaskit/icon/core/migration/refresh';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';
import { N0, N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';
import TableSearchCount, { AssetsItemCount } from '../common/modal/search-count';

import { footerMessages } from './messages';
import { PoweredByJSMAssets } from './powered-by-jsm-assets';
import { ProviderLink } from './provider-link';
import { SyncInfo } from './sync-info';

export type TableFooterProps = {
	datasourceId: string;
	itemCount?: number;
	onRefresh?: () => void;
	isLoading: boolean;
	url?: string;
};

const styles = cssMap({
	footer: {
		color: token('color.text.subtlest'),
		font: token('font.body.small'),
		paddingTop: token('space.100'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.100'),
		paddingLeft: token('space.200'),
		boxSizing: 'border-box',
		borderRadius: 'inherit',
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		backgroundColor: token('elevation.surface.raised'),
		borderTop: `1px solid ${token('color.border')}`,
	},
	separator: {
		color: token('color.border'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const FooterWrapper = styled.div({
	paddingTop: token('space.0', '0px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.0', '0px'),
	paddingLeft: token('space.200', '16px'),
	boxSizing: 'border-box',
	borderRadius: 'inherit',
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	backgroundColor: token('color.background.input', N0),
	borderTop: `2px solid ${token('color.background.accent.gray.subtler', N40)}`,
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TopBorderWrapper = styled.div({
	display: 'flex',
	boxSizing: 'border-box',
	justifyContent: 'space-between',
	paddingTop: token('space.250', '20px'),
	paddingRight: token('space.0', '0px'),
	paddingBottom: token('space.250', '20px'),
	paddingLeft: token('space.0', '0px'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SyncWrapper = styled.div({
	display: 'flex',
	alignItems: 'center',
	color: token('color.text.accent.gray'),
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const SyncTextWrapper = styled.div({
	marginRight: token('space.075', '6px'),
	font: token('font.body.UNSAFE_small'),
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

	if (fg('platform-linking-visual-refresh-sllv')) {
		return onRefresh || showItemCount ? (
			<div data-testid="table-footer" css={styles.footer}>
				<Inline alignBlock="center" alignInline="end" grow="hug" spread="space-between">
					<Box>
						<ProviderLink datasourceId={datasourceId} />
					</Box>
					<Inline
						alignBlock="center"
						space="space.100"
						separator={<div css={styles.separator}>•</div>}
					>
						{onRefresh && (
							<Inline alignBlock="center" space="space.050">
								<IconButton
									appearance="subtle"
									icon={(iconProps) => (
										<RefreshIcon {...iconProps} color={token('color.text.subtlest')} />
									)}
									isDisabled={isLoading}
									label={intl.formatMessage(footerMessages.refreshLabel)}
									onClick={onRefresh}
									spacing="compact"
									testId="refresh-button"
								/>
								<Box testId="sync-text">
									{isLoading ? (
										<FormattedMessage {...footerMessages.loadingText} />
									) : (
										<SyncInfo lastSyncTime={lastSyncTime} />
									)}
								</Box>
							</Inline>
						)}
						{showItemCount && (
							<Flex>
								{datasourceId === ASSETS_LIST_OF_LINKS_DATASOURCE_ID ? (
									<AssetsItemCount
										searchCount={itemCount as number}
										url={url}
										testId="item-count"
									/>
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
					</Inline>
				</Inline>
			</div>
		) : null;
	}

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
					<PoweredByJSMAssets
						text={intl.formatMessage(
							fg('assets_as_an_app_v2')
								? footerMessages.poweredByAssets
								: footerMessages.powerByJSM,
						)}
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
