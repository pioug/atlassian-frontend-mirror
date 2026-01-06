/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalTransition,
} from '@atlaskit/modal-dialog';

import { Cropper, type CropperRef } from './Cropper'
import { useImageFlip } from './imageEditActions';

interface ImageEditModalProps {
	errorReporter?: ErrorReporter;
	imageUrl?: string;
	isOpen: boolean;
	onClose: () => void;
	onSave: (imageData: Blob) => void;
}

const imageWrapper = css({
	height: 'calc(100vh - 250px)',
	width: '100%',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center'
});

const cropper = css({
	maxWidth: '100%',
	maxHeight: 'calc(100vh - 250px)',
	width: '100%',
	height: '100%',
});

const modalFooter = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%'
});

export const ImageEditor = ({ 
	imageUrl,
	isOpen, 
	onClose,
	onSave,
	errorReporter
 }: ImageEditModalProps) => {
	const cropperRef = useRef<CropperRef>(null);
	const { flipHorizontal, flipVertical } = useImageFlip(cropperRef);

	const handleSave = async () => {
		try {
			// Hard coded width to keep image quality high
			const canvas = await cropperRef.current?.getCroppedCanvas({ width: 2000 });
			if (canvas) {
				canvas.toBlob((blob) => {
					if (blob) {
						onSave?.(blob);
						onClose();
					}
				});
			}
		} catch (error) {
			if (errorReporter) {
				errorReporter.captureException(error instanceof Error ? error : new Error(String(error)));
			}
		}
	};

	return (
		<ModalTransition>
			{isOpen && (
				<Modal onClose={onClose} width={1800}>
					<br></br>
					<ModalBody>
						<div css={imageWrapper}>
							{imageUrl && (
								// Using the customized Cropper component
								<Cropper
									ref={cropperRef}
									src={imageUrl}
									alt="Crop me"
									crossOrigin="anonymous"
									css={cropper}
									initialCoverage={1}
								/>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						<div css={modalFooter}>
							<div>
								<Button onClick={flipHorizontal}>
									<FormattedMessage id="editor.imageEditor.flipHorizontal" defaultMessage="Flip Horizontal" />
								</Button>
								<Button onClick={flipVertical}>
									<FormattedMessage id="editor.imageEditor.flipVertical" defaultMessage="Flip Vertical" />
								</Button>
							</div>
							<div>
								<Button appearance="subtle" onClick={onClose}>
									<FormattedMessage id="editor.imageEditor.cancel" defaultMessage="Cancel" />
								</Button>
								<Button appearance="primary" onClick={handleSave}>
									<FormattedMessage id="editor.imageEditor.done" defaultMessage="Done" />
								</Button>
							</div>
						</div>
					</ModalFooter>
				</Modal>
			)}
		</ModalTransition>
	);
};
