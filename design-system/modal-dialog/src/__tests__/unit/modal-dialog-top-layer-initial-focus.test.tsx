import React, { useRef } from 'react';

import Button from '@atlaskit/button/default/button';
import Select from '@atlaskit/select/default';
import Textfield from '@atlaskit/textfield/text-field';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import { screen } from '@atlassian/testing-library/screen';
import { act, render } from '@atlassian/testing-library/testing-library/react';

import ModalBody from '../../modal-body';
import ModalDialog from '../../modal-dialog';
import ModalHeader from '../../modal-header';
import ModalTitle from '../../modal-title';

jest.mock('raf-schd', () => (fn: () => void) => fn);

/**
 * Waits for the work that runs after a commit: the dialog's animation settles in a promise
 * microtask (jsdom has no animations).
 */
async function flushAsyncWork() {
	await act(async () => {
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

/**
 * Renders and waits for the open to settle.
 */
async function renderAndSettle(element: React.ReactElement) {
	const view = render(element);
	await flushAsyncWork();
	return view;
}

function Header() {
	return (
		<ModalHeader hasCloseButton>
			<ModalTitle>Create</ModalTitle>
		</ModalHeader>
	);
}

/**
 * Smoke tests: the focus patterns that consumers check in their own jsdom tests work with the top
 * layer. `showModal()` runs before the content effects (`autoFocus`, ref callbacks, layout
 * effects), so a content `focus()` call works. The focus timing tests run in a browser
 * (`__tests__/playwright/top-layer-focus.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */
describe('ModalDialog top-layer initial focus', () => {
	beforeEach(() => {
		passGate('platform-dst-top-layer');
	});

	it('should be accessible with an `autoFocus` field', async () => {
		await renderAndSettle(
			<ModalDialog onClose={jest.fn()}>
				<Header />
				<ModalBody>
					<Textfield aria-label="Summary" autoFocus />
				</ModalBody>
			</ModalDialog>,
		);

		await expect(document.body).toBeAccessible();
	});

	it('should focus a Textfield with `autoFocus`, not the first focusable element', async () => {
		await renderAndSettle(
			<ModalDialog onClose={jest.fn()}>
				<Header />
				<ModalBody>
					<Textfield aria-label="Summary" autoFocus />
				</ModalBody>
			</ModalDialog>,
		);

		expect(screen.getByRole('textbox', { name: 'Summary' })).toHaveFocus();
	});

	it('should focus a Select with `autoFocus`', async () => {
		await renderAndSettle(
			<ModalDialog onClose={jest.fn()}>
				<Header />
				<ModalBody>
					<Select
						inputId="parent"
						aria-label="Parent"
						autoFocus
						options={[{ label: 'One', value: 'one' }]}
					/>
				</ModalBody>
			</ModalDialog>,
		);

		expect(screen.getByRole('combobox', { name: 'Parent' })).toHaveFocus();
	});

	it('should focus an `autoFocus` ref target', async () => {
		function WithRef() {
			const ref = useRef<HTMLButtonElement>(null);
			return (
				<ModalDialog onClose={jest.fn()} autoFocus={ref}>
					<Header />
					<ModalBody>
						<Button ref={ref}>Target</Button>
					</ModalBody>
				</ModalDialog>
			);
		}
		await renderAndSettle(<WithRef />);

		expect(screen.getByRole('button', { name: 'Target' })).toHaveFocus();
	});

	it('should honour an imperative `focus()` in a ref callback during the open', async () => {
		const focusOnMount = (element: HTMLInputElement | null) => {
			element?.focus();
		};
		await renderAndSettle(
			<ModalDialog onClose={jest.fn()}>
				<Header />
				<ModalBody>
					<input aria-label="Raw" ref={focusOnMount} />
				</ModalBody>
			</ModalDialog>,
		);

		expect(screen.getByRole('textbox', { name: 'Raw' })).toHaveFocus();
	});
});

describe('ModalDialog legacy initial focus', () => {
	beforeEach(() => {
		failGate('platform-dst-top-layer');
	});

	it('should focus a Textfield with `autoFocus`', async () => {
		await renderAndSettle(
			<ModalDialog onClose={jest.fn()}>
				<Header />
				<ModalBody>
					<Textfield aria-label="Summary" autoFocus />
				</ModalBody>
			</ModalDialog>,
		);

		expect(screen.getByRole('textbox', { name: 'Summary' })).toHaveFocus();
	});
});
