/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Modal, { ModalBody, ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';

interface ImageEditModalProps {
	imageUrl?: string;
	isOpen: boolean;
	onClose: () => void;
}

const imageWrapper = css({
	maxHeight: 'calc(100vh - 250px)',
	width: '100%',
	overflow: 'hidden',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
});

const imageStyle = css({
	maxWidth: '100%',
	maxHeight: 'calc(100vh - 250px)',
	width: 'auto',
	height: 'auto',
	objectFit: 'contain',
});

export const ImageEditor = ({ isOpen, onClose, imageUrl }: ImageEditModalProps) => {
	return (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={onClose} width={1800}>
					<br></br>
					<ModalBody>
						<div css={imageWrapper}>
							{imageUrl && <img src={imageUrl} alt="Edit preview" css={imageStyle} />}
						</div>
					</ModalBody>
					<ModalFooter>
						<Button appearance="subtle" onClick={onClose}>
							<FormattedMessage id="editor.imageEditor.cancel" defaultMessage="Cancel" />
						</Button>
						<Button appearance="primary" onClick={onClose}>
							<FormattedMessage id="editor.imageEditor.done" defaultMessage="Done" />
						</Button>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};
