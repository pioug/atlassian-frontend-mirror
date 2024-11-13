/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import {
	type DatasourceDataResponseItem,
	type DatasourceResponseSchemaProperty,
	type DatasourceTableStatusType,
} from '@atlaskit/linking-types';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AccessRequired } from '../../../common/error-state/access-required';
import { ModalLoadingError } from '../../../common/error-state/modal-loading-error';
import { NoResults } from '../../../common/error-state/no-results';
import {
	EmptyState,
	IssueLikeDataTableView,
	scrollableContainerShadowsCssComponents,
} from '../../../issue-like-table';

import { InitialStateView } from './initial-state-view';

export interface RenderAssetsContentProps {
	isFetchingInitialData: boolean;
	status: DatasourceTableStatusType;
	responseItems: DatasourceDataResponseItem[];
	responseItemIds: string[];
	visibleColumnKeys?: string[];
	datasourceId: string;
	aql?: string;
	schemaId?: string;
	onNextPage: () => void;
	hasNextPage: boolean;
	loadDatasourceDetails: () => Promise<void>;
	columns: DatasourceResponseSchemaProperty[];
	defaultVisibleColumnKeys: string[];
	onVisibleColumnKeysChange: (visibleColumnKeys: string[]) => void;
}

export const MODAL_HEIGHT = 420;

// This is to prevent y scrollbar when showing table loading state
const disableOverflowStyles = css({
	overflow: 'hidden',
});

const contentContainerStyles = css({
	height: MODAL_HEIGHT,
	display: 'grid',
	overflow: 'auto',
});

const tableBordersStyles = css({
	border: `1px solid ${token('color.border', N40)}`,
	borderTopLeftRadius: token('border.radius.200', '8px'),
	borderTopRightRadius: token('border.radius.200', '8px'),
	borderBottom: `2px solid ${token('color.background.accent.gray.subtler', N40)}`,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundImage: scrollableContainerShadowsCssComponents.backgroundImage,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundRepeat: scrollableContainerShadowsCssComponents.backgroundRepeat,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundSize: scrollableContainerShadowsCssComponents.backgroundSize,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	backgroundAttachment: scrollableContainerShadowsCssComponents.backgroundAttachment,
});

const RejectedView = () => (
	<div css={[contentContainerStyles]}>
		<ModalLoadingError />
	</div>
);

const UnauthorizedView = () => (
	<div css={[contentContainerStyles]}>
		<AccessRequired />
	</div>
);

const EmptyView = () => (
	<div css={[contentContainerStyles]}>
		<InitialStateView />
	</div>
);

const NoResultsView = () => (
	<div css={[contentContainerStyles]}>
		<NoResults />
	</div>
);

const LoadingView = () => (
	<div
		css={[
			contentContainerStyles,
			contentContainerStyles,
			tableBordersStyles,
			disableOverflowStyles,
		]}
	>
		<EmptyState testId="assets-aql-datasource-modal--loading-state" />
	</div>
);

export const RenderAssetsContent = (props: RenderAssetsContentProps) => {
	const {
		status,
		responseItems,
		responseItemIds,
		visibleColumnKeys,
		onNextPage,
		hasNextPage,
		loadDatasourceDetails,
		columns,
		defaultVisibleColumnKeys,
		onVisibleColumnKeysChange,
		isFetchingInitialData,
	} = props;

	const resolvedWithNoResults = status === 'resolved' && !responseItems.length;

	const issueLikeDataTableView = useMemo(
		() => (
			<div css={[contentContainerStyles, tableBordersStyles]}>
				<IssueLikeDataTableView
					testId="asset-datasource-table"
					status={status}
					columns={columns}
					items={responseItems}
					itemIds={responseItemIds}
					hasNextPage={hasNextPage}
					visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
					onNextPage={onNextPage}
					onLoadDatasourceDetails={loadDatasourceDetails}
					onVisibleColumnKeysChange={onVisibleColumnKeysChange}
				/>
			</div>
		),
		[
			columns,
			defaultVisibleColumnKeys,
			hasNextPage,
			loadDatasourceDetails,
			onNextPage,
			onVisibleColumnKeysChange,
			responseItems,
			responseItemIds,
			status,
			visibleColumnKeys,
		],
	);

	const renderAssetsContentView = useCallback(() => {
		if (isFetchingInitialData) {
			// Placing this check first as it's a priority before all others
			return <LoadingView />;
		} else if (status === 'rejected') {
			return <RejectedView />;
		} else if (status === 'unauthorized') {
			return <UnauthorizedView />;
		} else if (status === 'empty') {
			return <EmptyView />;
		} else if (resolvedWithNoResults) {
			return <NoResultsView />;
		} else if (status === 'loading' && !columns.length) {
			return <LoadingView />;
		}

		return issueLikeDataTableView;
	}, [
		columns.length,
		isFetchingInitialData,
		issueLikeDataTableView,
		resolvedWithNoResults,
		status,
	]);

	return renderAssetsContentView();
};
