import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as PageLayoutChatPanelConfluenceMockExample } from '../page-layout-chat-panel-confluence-mock';

export const PageLayoutChatPanelConfluenceMock: WorkbenchExample<
	typeof PageLayoutChatPanelConfluenceMockExample
> = wb(PageLayoutChatPanelConfluenceMockExample);
