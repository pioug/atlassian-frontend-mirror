import React from 'react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import InlineDialog from '@atlaskit/inline-dialog';
import { Text } from '@atlaskit/primitives/compiled';

const _default_1: React.JSX.Element[] = [
	<InlineDialog content={<div>This is an inline dialog</div>} isOpen={true}>
		<Button>Trigger</Button>
	</InlineDialog>,
	<InlineDialog
		content={
			<div>
				<Heading size="large">Dialog Title</Heading>
				<Text>Dialog content goes here</Text>
			</div>
		}
		isOpen={false}
	>
		<Button>Open Dialog</Button>
	</InlineDialog>,
];
export default _default_1;
