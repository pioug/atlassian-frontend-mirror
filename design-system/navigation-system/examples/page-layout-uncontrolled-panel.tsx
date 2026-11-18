import React from 'react';

import CallerOwnedPanelExample from './page-layout-caller-owned-panel';

export default function UncontrolledPanelExample(): JSX.Element {
	return <CallerOwnedPanelExample isControlled={false} />;
}
