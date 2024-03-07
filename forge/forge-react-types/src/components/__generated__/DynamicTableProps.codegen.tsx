/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - DynamicTableProps
 *
 * @codegen <<SignedSource::c890291e6c3787365ab3388ccd6fbbb2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/dynamictable/__generated__/index.partial.tsx <<SignedSource::6f2271a6205d0822b4d137943d8c81cf>>
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