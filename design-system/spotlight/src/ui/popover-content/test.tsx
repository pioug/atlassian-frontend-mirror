import React from 'react';

import { render, screen } from '@testing-library/react';

import { Text } from '@atlaskit/primitives/compiled';

import {
	PopoverContent,
	PopoverProvider,
	PopoverTarget,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
	SpotlightSecondaryAction,
} from '../../index';

describe('PopoverContent', () => {
	it('captures and report a11y violations', async () => {
		const { container } = render(
			<PopoverProvider>
				<PopoverTarget>Target</PopoverTarget>
				<PopoverContent testId="spotlight-popover-content" placement="bottom-center">
					<SpotlightCard>
						<SpotlightHeader>
							<SpotlightHeadline testId="spotlight-heading">Headline</SpotlightHeadline>
							<SpotlightControls>
								<SpotlightDismissControl />
							</SpotlightControls>
						</SpotlightHeader>
						<SpotlightBody testId="spotlight-body">
							<Text>Brief and direct textual content to elaborate on the intent.</Text>
						</SpotlightBody>
						<SpotlightFooter>
							<SpotlightActions>
								<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
								<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
							</SpotlightActions>
						</SpotlightFooter>
					</SpotlightCard>
				</PopoverContent>
			</PopoverProvider>,
		);

		await expect(container).toBeAccessible();
		expect(screen.getByTestId('spotlight-popover-content')).toHaveAccessibleName('Headline');
	});
});
