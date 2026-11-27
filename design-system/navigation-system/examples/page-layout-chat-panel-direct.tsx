import React from 'react';

import ChatPanelExample from './page-layout-chat-panel';
import LocalPanel from './utils/page-layout-chat-panel-local-panel';

// Layout tests exercise panel sizing and focus, not the lazy entrypoint.
export default function ChatPanelDirectExample(): JSX.Element {
	return <ChatPanelExample directLocalPanelContent={<LocalPanel />} />;
}
