import React from 'react';

import { Box, Text } from '@atlaskit/primitives/compiled';
import SectionMessage from '@atlaskit/section-message';

import TeamProfilecardTrigger from '../src/components/Team';

import ExampleWrapper from './helper/example-wrapper';
import { MainStage } from './helper/main-stage';
import { Section } from './helper/section';

/**
 * @deprecated TeamProfileCardTrigger is deprecated and provides no functionality.
 * It simply renders its children without any profile card behavior.
 * Use `@atlassian/team-profilecard` (TeamProfileCardWithTrigger) instead.
 */
export default function Example(): React.JSX.Element {
	return (
		<ExampleWrapper>
			<MainStage>
				<Section>
					<SectionMessage appearance="warning" title="Deprecated Component">
						<Text as="p">
							TeamProfileCardTrigger is deprecated and no longer provides any profile card
							functionality. It simply renders its children as-is.
						</Text>
						<Text as="p">
							Use <code>TeamProfileCardWithTrigger</code> from{' '}
							<code>@atlassian/team-profilecard</code> instead for team profile card functionality.
						</Text>
					</SectionMessage>
					<Box paddingBlockStart="space.200">
						<Text as="p">
							The component below wraps text with the deprecated trigger, which now just passes
							children through:
						</Text>
						<TeamProfilecardTrigger>
							<strong>This text is wrapped in the deprecated TeamProfileCardTrigger</strong>
						</TeamProfilecardTrigger>
					</Box>
				</Section>
			</MainStage>
		</ExampleWrapper>
	);
}
