/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useCallback, useMemo } from 'react';

import { css, jsx } from '@compiled/react';

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
import { EmptyState, IssueLikeDataTableView } from '../../../issue-like-table';

import { InitialStateView } from './initial-state-view';

export interface RenderAssetsContentProps {
	aql?: string;
	columns: DatasourceResponseSchemaProperty[];
	datasourceId: string;
	defaultVisibleColumnKeys: string[];
	hasNextPage: boolean;
	isFetchingInitialData: boolean;
	loadDatasourceDetails: () => Promise<void>;
	onNextPage: () => void;
	onVisibleColumnKeysChange: (visibleColumnKeys: string[]) => void;
	responseItemIds: string[];
	responseItems: DatasourceDataResponseItem[];
	schemaId?: string;
	status: DatasourceTableStatusType;
	visibleColumnKeys?: string[];
}

export const MODAL_HEIGHT = 420;

// This is to prevent y scrollbar when showing table loading state
const disableOverflowStyles = css({
	overflow: 'hidden',
});

const contentContainerStyles = css({
	height: 420,
	display: 'grid',
	overflow: 'auto',
});

const tableBordersStyles = css({
	border: `${token('border.width')} solid ${token('color.border', N40)}`,
	borderTopLeftRadius: token('radius.large', '8px'),
	borderTopRightRadius: token('radius.large', '8px'),
	borderBottom: `${token('border.width.selected')} solid ${token('color.background.accent.gray.subtler', N40)}`,
	backgroundImage: `
		linear-gradient(90deg, ${token('utility.elevation.surface.current', '#FFF')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(90deg, ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.1)')}, rgba(0, 0, 0, 0)),
		linear-gradient(90deg, rgba(255, 255, 255, 0), ${token('utility.elevation.surface.current', '#FFF')} 70%),
		linear-gradient(90deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.1)')}),
		linear-gradient(0deg, rgba(255, 255, 255, 0),  ${token('utility.elevation.surface.current', '#FFF')} 30%),
		linear-gradient(0deg, rgba(0, 0, 0, 0), ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.05)')}),
		linear-gradient(0deg, ${token('utility.elevation.surface.current', '#FFF')} 30%, rgba(255, 255, 255, 0)),
		linear-gradient(0deg, ${token('elevation.shadow.overflow.perimeter', 'rgba(0, 0, 0, 0.05)')}, rgba(0, 0, 0, 0))
		`,
	backgroundRepeat: 'no-repeat',
	backgroundSize:
		'40px 100%, 14px 100%, 40px 100%, 14px 100%, 100% 100px, 100% 14px, 100% 40px, 100% 10px',
	backgroundAttachment: 'local, scroll, local, scroll, local, scroll, local, scroll',
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
