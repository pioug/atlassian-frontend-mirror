import React from 'react';

import { ActionName, ElementName, SmartLinkDirection, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<TitleBlock
			direction={SmartLinkDirection.Vertical}
			metadata={[{ name: ElementName.State }]}
			subtitle={[{ name: ElementName.ModifiedBy }]}
			actions={[
				{
					name: ActionName.EditAction,
					onClick: () => console.log('Edit clicked!'),
				},
				{
					name: ActionName.DeleteAction,
					onClick: () => console.log('Delete clicked!'),
				},
			]}
		/>
	</ExampleContainer>
);
