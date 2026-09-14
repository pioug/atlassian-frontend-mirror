import { wb, type WorkbenchExample } from '@atlassian/workbench';

import IconExplorerExample from './01-icon-explorer';
import AllIconsExample from './02-all-icons';

const IconExplorer: WorkbenchExample = wb(IconExplorerExample);

export default IconExplorer;
export const AllIcons: WorkbenchExample = wb(AllIconsExample);
