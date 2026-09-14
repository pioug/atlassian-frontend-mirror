import { wb, type WorkbenchExample } from '@atlassian/workbench';

import BasicExample from './basic';
import BasicWithActionsExample from './basic-with-actions';
import ComposedExample from './composed';
import DynamicTableVsTableExample from './dynamic-table-vs-table';
import ExpandableExample from './expandable';
import MultiHeaderExample from './multi-header';
import RowExample from './row';
import SelectableAndExpandableExample from './selectable-and-expandable';
import TableWithDynamicTableDataExample from './table-with-dynamic-table-data';

const Basic: WorkbenchExample = wb(BasicExample);

export default Basic;
export const BasicWithActions: WorkbenchExample = wb(BasicWithActionsExample);
export const Composed: WorkbenchExample = wb(ComposedExample);
export const DynamicTableVsTable: WorkbenchExample = wb(DynamicTableVsTableExample);
export const Expandable: WorkbenchExample = wb(ExpandableExample);
export const MultiHeader: WorkbenchExample = wb(MultiHeaderExample);
export const Row: WorkbenchExample = wb(RowExample);
export const SelectableAndExpandable: WorkbenchExample = wb(SelectableAndExpandableExample);
export const TableWithDynamicTableData: WorkbenchExample = wb(TableWithDynamicTableDataExample);
