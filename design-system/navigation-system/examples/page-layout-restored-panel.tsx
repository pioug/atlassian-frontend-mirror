import React from 'react';

import CallerOwnedPanelExample from './page-layout-caller-owned-panel';

export default function RestoredPanelExample(): JSX.Element {
	return <CallerOwnedPanelExample isControlled={false} defaultPanelWidth={500} />;
}
