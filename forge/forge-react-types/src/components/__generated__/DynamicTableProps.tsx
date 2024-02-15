/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - DynamicTableProps
 *
 * @codegen <<SignedSource::f81add87c2f7438640309edfb4a24f2b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/dynamictable/__generated__/index.partial.tsx <<SignedSource::4a9a4e06a29e22351544108eaa81f87e>>
 */
import type { RowType, StatefulProps } from '@atlaskit/dynamic-table/types';

type NewRowType = Pick<RowType, 'cells' | 'key' | 'isHighlighted'>;

export type DynamicTableProps = Pick<
StatefulProps,
  'defaultPage' | 'defaultSortKey' | 'defaultSortOrder' | 'emptyView' | 'head' | 'highlightedRowIndex' | 'isFixedSize' | 'isLoading' | 'isRankable' | 'label' | 'loadingSpinnerSize' | 'onRankEnd' | 'onRankStart' | 'onSetPage' | 'page' | 'paginationi18n' | 'rowsPerPage' | 'sortKey' | 'sortOrder' | 'testId'
  > & {
  rows?: NewRowType[];
  caption?: string;
};