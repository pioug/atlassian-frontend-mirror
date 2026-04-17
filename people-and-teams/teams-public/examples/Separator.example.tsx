import React from 'react';

import { Inline, Text } from '@atlaskit/primitives/compiled';
import { Playground } from '@atlassian/teams-app-internal-playground/playground';


import { Separator } from '../src';

export default function Example(): React.JSX.Element {
	return (
		<Playground>
			{() => (
				<Inline alignBlock="center" space="space.050">
					<Text size="small" color="color.text.subtle">
						Left text
					</Text>
					<Separator />
					<Text size="small" color="color.text.subtle">
						Right text
					</Text>
				</Inline>
			)}
		</Playground>
	);
}
