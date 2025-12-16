import React from 'react';

import noop from '@atlaskit/ds-lib/noop';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';

const SomeParts = ({
	body,
	title,
	actions,
}: {
	body?: boolean;
	title?: boolean;
	actions?: boolean;
}) => (
	<SectionMessage
		title={title ? 'The Modern Prometheus' : undefined}
		actions={
			actions
				? [
						<SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
							Mary
						</SectionMessageAction>,
						<SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
							Villa Diodatti
						</SectionMessageAction>,
						<SectionMessageAction onClick={() => noop}>M. J. Godwin</SectionMessageAction>,
					]
				: []
		}
	>
		{body && (
			<Text as="p">
				You will rejoice to hear that no disaster has accompanied the commencement of an enterprise
				which you have regarded with such evil forebodings. I arrived here yesterday, and my first
				task is to assure my dear sister of my welfare and increasing confidence in the success of
				my undertaking.
			</Text>
		)}
	</SectionMessage>
);

const Example = (): React.JSX.Element => (
	<>
		<Text>
			This example has been constructed for ease-of-reference and comparison in developing section
			message. It is not a suggested implementation.
		</Text>
		<Box padding="space.100">
			<Stack space="space.200">
				<SomeParts body title actions />
				<SomeParts body title />
				<SomeParts body actions />
				<SomeParts title actions />
				<SomeParts body />
				<SomeParts title />
				<SomeParts actions />
			</Stack>
		</Box>
	</>
);

export default Example;
