import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import InlineDialog from '@atlaskit/inline-dialog';

/**
 * Test fixture: exercises the initial-focus matrix that `top-layer/useInitialFocus`
 * is responsible for, expressed through the public `InlineDialog` API.
 *
 * `InlineDialog` is a `role="dialog"` popover, so the relevant branches are:
 *
 * - `default-inline-dialog`: no native HTML `autofocus` element inside the
 *   popover; focus must move to the first focusable element.
 *
 * - `autofocus-inline-dialog`: an interior `<input>` carries the native
 *   `autofocus` attribute; focus must land on that input.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */
export default function TestingInitialFocusMatrix(): React.ReactNode {
	const [defaultOpen, setDefaultOpen] = useState(false);
	const [autoFocusOpen, setAutoFocusOpen] = useState(false);

	const setNativeAutofocus = useCallback((node: HTMLInputElement | null) => {
		if (node === null) {
			return;
		}
		node.setAttribute('autofocus', '');
	}, []);

	return (
		<div>
			<section>
				<h3>default content</h3>
				<InlineDialog
					isOpen={defaultOpen}
					onClose={() => setDefaultOpen(false)}
					content={
						<div data-testid="default-inline-dialog-content">
							<Button testId="default-inline-dialog-first-button" onClick={() => {}}>
								First action
							</Button>
							<Button testId="default-inline-dialog-second-button" onClick={() => {}}>
								Second action
							</Button>
						</div>
					}
				>
					<Button
						testId="default-inline-dialog-trigger"
						onClick={() => setDefaultOpen((prev) => !prev)}
					>
						Open default inline dialog
					</Button>
				</InlineDialog>
			</section>

			<section>
				<h3>autofocus input</h3>
				<InlineDialog
					isOpen={autoFocusOpen}
					onClose={() => setAutoFocusOpen(false)}
					content={
						<div data-testid="autofocus-inline-dialog-content">
							<label htmlFor="autofocus-inline-dialog-input">Name</label>
							<input
								id="autofocus-inline-dialog-input"
								data-testid="autofocus-inline-dialog-input"
								ref={setNativeAutofocus}
								type="text"
							/>
							<Button testId="autofocus-inline-dialog-close" onClick={() => {}}>
								Action
							</Button>
						</div>
					}
				>
					<Button
						testId="autofocus-inline-dialog-trigger"
						onClick={() => setAutoFocusOpen((prev) => !prev)}
					>
						Open autofocus inline dialog
					</Button>
				</InlineDialog>
			</section>
		</div>
	);
}
