import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AnimationDemoExample from './03-animation-demo';
import SizeFunctionVrExample from './09-size-function.vr.ap';
import SkeletonExample from './10-skeleton';
import PerfExample from './100-perf';
import NewIconExplorerExample from './101-new-icon-explorer';
import NewIconsExample from './102-new-icons';
import NewIconInButtonExample from './103-new-icon-in-button';
import NewIconsSizeVrExample from './107-new-icons-size.vr.ap';
import IconTileVrExample from './110-icon-tile.vr.ap';

const AnimationDemo: WorkbenchExample = wb(AnimationDemoExample);

export default AnimationDemo;
export const SizeFunctionVr: WorkbenchExample = wb(SizeFunctionVrExample);
export const Skeleton: WorkbenchExample = wb(SkeletonExample);
export const Perf: WorkbenchExample = wb(PerfExample);
export const NewIconExplorer: WorkbenchExample = wb(NewIconExplorerExample);
export const NewIcons: WorkbenchExample = wb(NewIconsExample);
export const NewIconInButton: WorkbenchExample = wb(NewIconInButtonExample);
export const NewIconsSizeVr: WorkbenchExample = wb(NewIconsSizeVrExample);
export const IconTileVr: WorkbenchExample = wb(IconTileVrExample);
