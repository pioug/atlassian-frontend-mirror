import { wb, type WorkbenchExample } from '@atlassian/workbench';

import AllAssetsExample from './00-all-assets';
import WithAvatarExample from './01-with-avatar';
import WithBackgroundColorExample from './02-with-background-color';

export const AllAssets: WorkbenchExample = wb(AllAssetsExample);
export const WithAvatar: WorkbenchExample = wb(WithAvatarExample);
export const WithBackgroundColor: WorkbenchExample = wb(WithBackgroundColorExample);
