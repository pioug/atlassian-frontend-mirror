import { wb, type WorkbenchExample } from '@atlassian/workbench';

import GridCardsVrExample from '../01-grid-cards.vr.ap';
import GridWidthsVrExample from '../02-grid-widths.vr.ap';
import GridNoInlinePaddingVrExample from '../03-grid-no-inline-padding.vr.ap';
import GridPageLayoutExample from '../10-grid-page-layout';
import GridHiddenItemVrExample from '../20-grid-hidden-item.vr.ap';
import JsmGridExample from '../90-jsm-grid';
import JsmSecondaryCardExample from '../93-jsm-secondary-card';
import GridContainerVrExample from '../96-grid-container.vr.ap';

export const GridCards: WorkbenchExample<typeof GridCardsVrExample> = wb(GridCardsVrExample);

export const GridWidthsVr: WorkbenchExample<typeof GridWidthsVrExample> = wb(GridWidthsVrExample);
export const GridNoInlinePaddingVr: WorkbenchExample<typeof GridNoInlinePaddingVrExample> = wb(
	GridNoInlinePaddingVrExample,
);
export const GridPageLayout: WorkbenchExample<typeof GridPageLayoutExample> =
	wb(GridPageLayoutExample);
export const GridHiddenItemVr: WorkbenchExample<typeof GridHiddenItemVrExample> =
	wb(GridHiddenItemVrExample);
export const JsmGrid: WorkbenchExample<typeof JsmGridExample> = wb(JsmGridExample);
export const JsmSecondaryCard: WorkbenchExample<typeof JsmSecondaryCardExample> =
	wb(JsmSecondaryCardExample);
// Named "GridContainer" to match the Workbench URL used by existing integration tests.
export const GridContainer: WorkbenchExample<typeof GridContainerVrExample> =
	wb(GridContainerVrExample);
