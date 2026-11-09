import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import ModalBody from '@atlaskit/modal-dialog/modal-body';
import ModalDialog from '@atlaskit/modal-dialog/modal-dialog';
import ModalFooter from '@atlaskit/modal-dialog/modal-footer';
import ModalHeader from '@atlaskit/modal-dialog/modal-header';
import ModalTitle from '@atlaskit/modal-dialog/modal-title';
import ModalTransition from '@atlaskit/modal-dialog/modal-transition';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Text } from '@atlaskit/primitives/compiled/text';

const styles = cssMap({
	// `flex: 1`: a `0%` flex basis, so the content height does not size this element.
	flexChild: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: '0%',
		minHeight: '0px',
		overflow: 'hidden',
	},
});

type TVariant = 'body-scroll' | 'viewport-scroll';

/**
 * Test fixture: a modal with no `height` whose content is in a `flex: 1` child with
 * `overflow: hidden`, as in the Confluence share dialog. The modal sizes to its content.
 */
export default function TestingFlexChildWithoutHeight(): React.JSX.Element {
	const [variant, setVariant] = useState<TVariant | null>(null);
	const close = useCallback(() => setVariant(null), []);

	return (
		<>
			<Button aria-haspopup="dialog" onClick={() => setVariant('body-scroll')}>
				Open with body scroll
			</Button>
			<Button aria-haspopup="dialog" onClick={() => setVariant('viewport-scroll')}>
				Open with viewport scroll
			</Button>

			<ModalTransition>
				{variant && (
					<ModalDialog onClose={close} shouldScrollInViewport={variant === 'viewport-scroll'}>
						<Box xcss={styles.flexChild}>
							<ModalHeader hasCloseButton>
								<ModalTitle>Flex child without a height</ModalTitle>
							</ModalHeader>
							<ModalBody>
								<Text as="p">The modal is as tall as its content.</Text>
							</ModalBody>
							<ModalFooter>
								<Button onClick={close} appearance="primary">
									Close
								</Button>
							</ModalFooter>
						</Box>
					</ModalDialog>
				)}
			</ModalTransition>
		</>
	);
}
