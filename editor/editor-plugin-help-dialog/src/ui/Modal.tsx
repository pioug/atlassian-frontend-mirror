/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports
import { jsx } from '@emotion/react';

import { useModal } from '@atlaskit/modal-dialog';

import type { Format } from './Format';
import { ModalContent } from './ModalContent';

interface ModalProps {
	formatting: Format[];
}

const Modal = ({ formatting }: ModalProps): jsx.JSX.Element => {
	const { onClose } = useModal();
	return <ModalContent formatting={formatting} onClose={onClose} />;
};

export default Modal;
