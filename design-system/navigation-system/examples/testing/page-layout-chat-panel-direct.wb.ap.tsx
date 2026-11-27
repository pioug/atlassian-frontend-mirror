import { wb, type WorkbenchExample } from '@atlassian/workbench';

import ChatPanelDirectExample from '../page-layout-chat-panel-direct';

export const PageLayoutChatPanelDirect: WorkbenchExample<typeof ChatPanelDirectExample> =
	wb(ChatPanelDirectExample);
