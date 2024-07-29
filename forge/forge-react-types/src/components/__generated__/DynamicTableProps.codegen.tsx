/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - DynamicTableProps
 *
 * @codegen <<SignedSource::a94f2279c473d118f861eedfcc90543c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/dynamictable/__generated__/index.partial.tsx <<SignedSource::48b2b4eac0a51cd071bfa077e923eb3f>>
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