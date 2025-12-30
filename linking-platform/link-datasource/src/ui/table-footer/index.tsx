/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { IconButton } from '@atlaskit/button/new';
import RefreshIcon from '@atlaskit/icon/core/refresh';
import { Box, Flex, Inline } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../assets-modal';
import TableSearchCount, { AssetsItemCount } from '../common/modal/search-count';

import { footerMessages } from './messages';
import { ProviderLink } from './provider-link';
import { SyncInfo } from './sync-info';

export type TableFooterProps = {
	datasourceId: string;
	isLoading: boolean;
	itemCount?: number;
	onRefresh?: () => void;
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
		borderTop: `${token('border.width')} solid ${token('color.border')}`,
	},
	separator: {
		color: token('color.border'),
	},
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
				</Inline>
			</Inline>
		</div>
	) : null;
};
