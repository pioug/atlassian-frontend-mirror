import { wb, type WorkbenchExample } from '@atlassian/workbench';

import HeadingExample from './01-heading';
import LinksExample from './02-links';
import ListsFlatExample from './03-lists-flat';
import ListsNestedExample from './04-lists-nested';
import TablesSimpleExample from './05-tables-simple';
import TablesComplexExample from './06-tables-complex';
import QuotesExample from './07-quotes';
import CodeAndPreExample from './08-code-and-pre';
import MiscElementsExample from './09-misc-elements';
import SubtreeThemingVrExample from './10-subtree-theming.vr.ap';
import ScrollbarsExample from './11-scrollbars';

const Heading: WorkbenchExample = wb(HeadingExample);

export default Heading;
export const Links: WorkbenchExample = wb(LinksExample);
export const ListsFlat: WorkbenchExample = wb(ListsFlatExample);
export const ListsNested: WorkbenchExample = wb(ListsNestedExample);
export const TablesSimple: WorkbenchExample = wb(TablesSimpleExample);
export const TablesComplex: WorkbenchExample = wb(TablesComplexExample);
export const Quotes: WorkbenchExample = wb(QuotesExample);
export const CodeAndPre: WorkbenchExample = wb(CodeAndPreExample);
export const MiscElements: WorkbenchExample = wb(MiscElementsExample);
export const SubtreeThemingVr: WorkbenchExample = wb(SubtreeThemingVrExample);
export const Scrollbars: WorkbenchExample = wb(ScrollbarsExample);
