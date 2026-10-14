import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as PageLayoutChatPanelExample } from '../page-layout-chat-panel';

export const PageLayoutChatPanel: WorkbenchExample<typeof PageLayoutChatPanelExample> = wb(
	PageLayoutChatPanelExample,
);
