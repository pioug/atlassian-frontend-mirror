import { tester } from '../../__tests__/utils/_tester';
import rule, { addHasCloseButtonProp, ruleName, setHasCloseButtonPropToTrue } from '../index';

tester.run(ruleName, rule, {
	valid: [
		// Ignore code that is not ours
		`
import Foo from 'bar';

<Foo />
		`,
		`
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
		`,
		`
import ModalDialog, { CloseButton, ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<Box>
			<ModalTitle>Modal Title</ModalTitle>
			<CloseButton onClick={onClose} />
		</Box>
	</ModalHeader>
</ModalDialog>
`,
		`
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader hasCloseButton>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
		`
import AkModalDialog, { CloseButton as AkCloseButton, ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader>
		<Box>
			<AkModalTitle>AkModal Title</AkModalTitle>
			<AkCloseButton onClick={onClose} />
		</Box>
	</AkModalHeader>
</AkModalDialog>
`,
		`
import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Checkbox } from '@atlaskit/checkbox';
import Form, { CheckboxField, Field } from '@atlaskit/form';
import ModalDialog, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

export default function FormAsContainer() {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);
	const onFormSubmit = useCallback((data: Object) => alert(JSON.stringify(data, null, 4)), []);

	return (
		<>
			<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
				Open Modal
			</Button>

			<ModalTransition>
				{isOpen && (
					<ModalDialog onClose={close} testId="modal">
						<Form onSubmit={onFormSubmit}>
							{({ formProps }) => (
								<form {...formProps} id="modal-form">
									<ModalHeader hasCloseButton>
										<ModalTitle>Form as Container Demo</ModalTitle>
									</ModalHeader>
								</form>
							)}
						</Form>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}

`,
		`
import React, { useCallback, useRef, useState } from 'react';

import Lorem from 'react-lorem-component';

import Button from '@atlaskit/button/new';
import Checkbox from '@atlaskit/checkbox';
import { Field } from '@atlaskit/form';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box, Stack, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	height: '200%',
});

export default function ExampleScroll() {
	const [isOpen, setIsOpen] = useState(false);
	const [titleShown, setTitleShown] = useState(true);
	const [shouldScrollInViewport, setShouldScrollInViewPort] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = useCallback(() => bottomRef.current?.scrollIntoView(true), []);

	return (
		<Box xcss={containerStyles} padding="space.200">
			<Stack space="space.200" alignInline="start">
				<p>
					The scroll behavior of modals can be configured so that scrolling happens inside the modal
					body or outside the modal, within the viewport.
				</p>
				<p>
					In either case, modals prevent the window from being scrolled both natively and
					programatically. This means that certain browser issues such as{' '}
					<code>scrollIntoView</code> scrolling the window instead of only the closest scroll parent
					will be prevented.
				</p>
				<Field name="sb" label="Scrolling behavior">
					{() => (
						<Checkbox
							label="Should scroll within the viewport"
							name="scroll"
							testId="scroll"
							onChange={(e) => setShouldScrollInViewPort(e.target.checked)}
							isChecked={shouldScrollInViewport}
						/>
					)}
				</Field>
				<Field name="hs" label="Visibility">
					{() => (
						<Checkbox
							label="Header/footer shown"
							name="visibility"
							testId="visibility"
							onChange={(e) => setTitleShown(e.target.checked)}
							isChecked={titleShown}
						/>
					)}
				</Field>

				<Button aria-haspopup="dialog" appearance="primary" onClick={open} testId="modal-trigger">
					Open modal
				</Button>
			</Stack>
			<ModalTransition>
				{isOpen && (
					<Modal
						label="Modal Label"
						onClose={close}
						shouldScrollInViewport={shouldScrollInViewport}
						testId="modal"
					>
						{titleShown && (
							<ModalHeader hasCloseButton>
								<ModalTitle>Modal Title</ModalTitle>
							</ModalHeader>
						)}
						<ModalBody>
							<Lorem count={10} />
							<Box ref={bottomRef} />
						</ModalBody>
						{titleShown && (
							<ModalFooter>
								<Button testId="scrollDown" appearance="subtle" onClick={scrollToBottom}>
									Scroll to bottom
								</Button>
								<Button testId="primary" appearance="primary" onClick={close}>
									Close
								</Button>
							</ModalFooter>
						)}
					</Modal>
				)}
			</ModalTransition>
		</Box>
	);
}

`,
	],
	invalid: [
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderMissingHasCloseButtonProp',
					suggestions: [
						{
							desc: addHasCloseButtonProp,
							output: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderMissingHasCloseButtonProp',
					suggestions: [
						{
							desc: addHasCloseButtonProp,
							output: `
import AkModalDialog, { ModalHeader as AkModalHeader, ModalTitle as AkModalTitle } from '@atlaskit/modal-dialog';

<AkModalDialog>
	<AkModalHeader hasCloseButton>
		<AkModalTitle>AkModal Title</AkModalTitle>
	</AkModalHeader>
</AkModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton={false}>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'modalHeaderHasCloseButtonPropIsFalse',
					suggestions: [
						{
							desc: setHasCloseButtonPropToTrue,
							output: `
import ModalDialog, { ModalHeader, ModalTitle } from '@atlaskit/modal-dialog';

<ModalDialog>
	<ModalHeader hasCloseButton>
		<ModalTitle>Modal Title</ModalTitle>
	</ModalHeader>
</ModalDialog>
`,
						},
					],
				},
			],
		},
		{
			code: `
import ModalDialog, { ModalTitle } from '@atlaskit/modal-dialog';
import CustomModalHeader from 'custom-modal-header';

<ModalDialog>
	<CustomModalHeader>
		<ModalTitle>Modal Title</ModalTitle>
	</CustomModalHeader>
</ModalDialog>
`,
			errors: [
				{
					messageId: 'noCloseButtonExists',
				},
			],
		},
	],
});
