import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Box, Stack, Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { PopoverContent } from '@atlaskit/spotlight/popover-content';
import { PopoverProvider } from '@atlaskit/spotlight/popover-provider';
import { PopoverTarget } from '@atlaskit/spotlight/popover-target';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';

/**
 * Test fixture: exercises the initial-focus matrix that `top-layer/useInitialFocus`
 * is responsible for, expressed through the public `Spotlight` API.
 *
 * `SpotlightCard` ultimately renders a `role="dialog"` popover, so the
 * relevant branches mirror the modal-dialog and inline-dialog fixtures:
 *
 * - `default-spotlight`: no native HTML `autofocus` element. Focus must
 *   move to the first focusable element inside the spotlight (the dismiss
 *   control in the header).
 *
 * - `autofocus-spotlight`: an interior `<input>` carries the native HTML
 *   `autofocus` attribute. Focus must land on that input.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [variant, setVariant] = useState<'none' | 'default' | 'autofocus'>('none');

	const dismiss = useCallback(() => setVariant('none'), []);

	const setNativeAutofocus = useCallback((node: HTMLInputElement | null) => {
		if (node === null) {
			return;
		}
		node.setAttribute('autofocus', '');
	}, []);

	return (
		<Box padding="space.200">
			<Stack space="space.200">
				<Button testId="default-spotlight-trigger" onClick={() => setVariant('default')}>
					Open default spotlight
				</Button>
				<Button testId="autofocus-spotlight-trigger" onClick={() => setVariant('autofocus')}>
					Open autofocus spotlight
				</Button>

				<PopoverProvider>
					<PopoverTarget>
						<Box padding="space.100">
							<Text>Spotlight target</Text>
						</Box>
					</PopoverTarget>
					<PopoverContent dismiss={dismiss} placement="bottom-end" isVisible={variant !== 'none'}>
						<SpotlightCard
							testId={variant === 'autofocus' ? 'autofocus-spotlight' : 'default-spotlight'}
						>
							<SpotlightHeader>
								<SpotlightHeadline>
									{variant === 'autofocus' ? 'Autofocus spotlight' : 'Default spotlight'}
								</SpotlightHeadline>
								<SpotlightControls>
									<SpotlightDismissControl />
								</SpotlightControls>
							</SpotlightHeader>
							<SpotlightBody>
								{variant === 'autofocus' ? (
									<>
										<label htmlFor="autofocus-spotlight-input">Name</label>
										<input
											id="autofocus-spotlight-input"
											data-testid="autofocus-spotlight-input"
											ref={setNativeAutofocus}
											type="text"
										/>
									</>
								) : (
									<Text>No autofocus inside; first focusable should win.</Text>
								)}
							</SpotlightBody>
							<SpotlightFooter>
								<SpotlightActions>
									<SpotlightPrimaryAction
										onClick={dismiss}
										testId={
											variant === 'autofocus'
												? 'autofocus-spotlight-primary'
												: 'default-spotlight-primary'
										}
									>
										Done
									</SpotlightPrimaryAction>
								</SpotlightActions>
							</SpotlightFooter>
						</SpotlightCard>
					</PopoverContent>
				</PopoverProvider>
			</Stack>
		</Box>
	);
}
