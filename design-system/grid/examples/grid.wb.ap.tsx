import { wb, type WorkbenchExample } from '@atlassian/workbench';

import GridCardsVrExample from './01-grid-cards.vr.ap';
import GridWidthsVrExample from './02-grid-widths.vr.ap';
import GridNoInlinePaddingVrExample from './03-grid-no-inline-padding.vr.ap';
import GridPageLayoutExample from './10-grid-page-layout';
import GridHiddenItemVrExample from './20-grid-hidden-item.vr.ap';
import JsmGridExample from './90-jsm-grid';
import JsmSecondaryCardExample from './93-jsm-secondary-card';
import GridContainerVrExample from './96-grid-container.vr.ap';

// Explicit named export Used to generate integration-test URLs.
export const GridCards: WorkbenchExample = wb(GridCardsVrExample);

// Default export required by accessibility tooling.
export default GridCards;
export const GridWidthsVr: WorkbenchExample = wb(GridWidthsVrExample);
export const GridNoInlinePaddingVr: WorkbenchExample = wb(GridNoInlinePaddingVrExample);
export const GridPageLayout: WorkbenchExample = wb(GridPageLayoutExample);
export const GridHiddenItemVr: WorkbenchExample = wb(GridHiddenItemVrExample);
export const JsmGrid: WorkbenchExample = wb(JsmGridExample);
export const JsmSecondaryCard: WorkbenchExample = wb(JsmSecondaryCardExample);
// Named "GridContainer" to match the Workbench URL used by existing integration tests.
export const GridContainer: WorkbenchExample = wb(GridContainerVrExample);
