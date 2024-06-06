import React from 'react';
import { ElementName, TitleBlock } from '../../src';
import ExampleContainer from './example-container';

export default () => (
	<ExampleContainer>
		<TitleBlock
			metadata={[
				{ name: ElementName.Priority },
				{ name: ElementName.State },
				{ name: ElementName.CollaboratorGroup },
			]}
		/>
	</ExampleContainer>
);
