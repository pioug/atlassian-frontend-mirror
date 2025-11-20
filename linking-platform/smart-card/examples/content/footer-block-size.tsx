import React from 'react';

import { type ActionItem, ActionName, FooterBlock, SmartLinkSize } from '../../src';

import ExampleContainer from './example-container';

const actions = [
	{ name: ActionName.DeleteAction, onClick: () => {}, hideContent: true },
] as ActionItem[];

export default (): React.JSX.Element => (
	<ExampleContainer>
		<FooterBlock size={SmartLinkSize.Small} actions={actions} />
		<br />
		<FooterBlock size={SmartLinkSize.Medium} actions={actions} />
		<br />
		<FooterBlock size={SmartLinkSize.Large} actions={actions} />
		<br />
		<FooterBlock size={SmartLinkSize.XLarge} actions={actions} />
	</ExampleContainer>
);
