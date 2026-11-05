import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import Form from '@atlaskit/form/form';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import PlaceholderContent from './placeholder-content';

type TVariant = 'height' | 'form';

const expectation = 'The modal fits the viewport. The body scrolls and the footer stays in view.';

/**
 * Test fixture: modals taller than the viewport. `height` sets a height taller than the viewport.
 * `form` wraps the header, body and footer in a form, with content taller than the viewport.
 */
export default function TestingTallerThanViewport(): React.JSX.Element {
	const [variant, setVariant] = useState<TVariant | null>(null);
	const close = useCallback(() => setVariant(null), []);

	return (
		<>
			<Button aria-haspopup="dialog" onClick={() => setVariant('height')}>
				Open with a height of 150vh
			</Button>
			<Button aria-haspopup="dialog" onClick={() => setVariant('form')}>
				Open with a form around tall content
			</Button>

			<ModalTransition>
				{variant === 'height' && (
					<ModalDialog onClose={close} height="150vh">
						<ModalHeader hasCloseButton>
							<ModalTitle>Height of 150vh</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<Stack space="space.150">
								<Text as="p">{expectation}</Text>
								<PlaceholderContent count={10} />
							</Stack>
						</ModalBody>
						<ModalFooter>
							<Button onClick={close} appearance="primary">
								Close
							</Button>
						</ModalFooter>
					</ModalDialog>
				)}
				{variant === 'form' && (
					<ModalDialog onClose={close}>
						<Form onSubmit={close}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Form around tall content</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Stack space="space.150">
									<Text as="p">{expectation}</Text>
									<PlaceholderContent count={10} />
								</Stack>
							</ModalBody>
							<ModalFooter>
								<Button appearance="primary" type="submit">
									Submit
								</Button>
							</ModalFooter>
						</Form>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
