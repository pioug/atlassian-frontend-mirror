import React from 'react';

import { ElementName, SmartLinkSize, TitleBlock } from '../../src';

import ExampleContainer from './example-container';

export default (): React.JSX.Element => (
	<ExampleContainer>
		<TitleBlock
			size={SmartLinkSize.Small}
			metadata={[
				{ name: ElementName.Priority },
				{ name: ElementName.State },
				{ name: ElementName.CollaboratorGroup },
			]}
			subtitle={[
				{ name: ElementName.CreatedOn },
				{ name: ElementName.ModifiedOn },
				{ name: ElementName.CommentCount },
			]}
		/>
	</ExampleContainer>
);
