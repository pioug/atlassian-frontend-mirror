/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { FormattedMessage, IntlProvider } from 'react-intl-next';

import AtlassianProvider from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Modal, { ModalBody, ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import { token } from '@atlaskit/tokens';

import { Cropper, type CropperRef } from './Cropper';
import { FlipHorizontalIcon } from './icons/FlipHorizontalIcon';
import { FlipVerticalIcon } from './icons/FlipVerticalIcon';
import { RatioIcon } from './icons/RatioIcon';
import { RotateIcon } from './icons/RotateIcon';
import { useImageFlip, useImageRotate } from './imageEditActions';

interface ImageEditModalProps {
	errorReporter?: ErrorReporter;
	imageUrl?: string;
	isOpen: boolean;
	onClose: () => void;
	onSave: (imageData: Blob, width: number, height: number) => void;
}

const imageWrapper = css({
	height: 'calc(100vh - 250px)',
	width: '100%',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
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
	width: '100%',
});

const ratioBtn = css({
	display: 'flex',
	alignItems: 'center',
	gap: token('space.100', '8px'),
});

export const ImageEditor = ({
	imageUrl,
	isOpen,
	onClose,
	onSave,
	errorReporter,
}: ImageEditModalProps) => {
	const cropperRef = useRef<CropperRef>(null);
	const [isImageReady, setIsImageReady] = useState(false);
	const { flipHorizontal, flipVertical } = useImageFlip(cropperRef);
	const { rotateRight } = useImageRotate(cropperRef);

	const handleSave = async () => {
		try {
			// Hard coded width to keep image quality high
			const canvas = await cropperRef.current?.getCroppedCanvas({ width: 1500 });
			if (canvas) {
				const outWidth = canvas.width;
				const outHeight = canvas.height;
				canvas.toBlob((blob) => {
					if (blob) {
						onSave?.(blob, outWidth, outHeight);
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
		<IntlProvider locale="en">
			<AtlassianProvider>
				<ModalTransition>
					{isOpen && (
						<Modal
							onClose={onClose}
							width={1800}
							testId="image-editor-modal"
							label="Image editor modal"
						>
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
											onImageReady={setIsImageReady}
										/>
									)}
								</div>
							</ModalBody>
							<ModalFooter>
								<div css={modalFooter}>
									<div>
										<DropdownMenu
											appearance="default"
											trigger={({ triggerRef, ...props }) => (
												<Button
													ref={triggerRef}
													appearance="subtle"
													isDisabled={!isImageReady}
													onClick={props.onClick}
													onBlur={props.onBlur}
													onFocus={props.onFocus}
												>
													<div css={ratioBtn}>
														<RatioIcon label='change aspect ratio button' isDisabled={!isImageReady} />
														<FormattedMessage
															id="editor.imageEditor.aspectRatio"
															defaultMessage="Aspect Ratio"
														/>
														<ChevronDownIcon label="" size="small" />
													</div>
												</Button>
											)}
										>
											<DropdownItemGroup>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.original"
														defaultMessage="Original"
													/>
												</DropdownItem>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.custom"
														defaultMessage="Custom"
													/>
												</DropdownItem>
											</DropdownItemGroup>
											<DropdownItemGroup hasSeparator>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.square"
														defaultMessage="Square 1:1"
													/>
												</DropdownItem>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.circle"
														defaultMessage="Circle 1:1"
													/>
												</DropdownItem>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.landscape"
														defaultMessage="Landscape 4:3"
													/>
												</DropdownItem>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.portrait"
														defaultMessage="Portrait 3:4"
													/>
												</DropdownItem>
												<DropdownItem>
													<FormattedMessage
														id="editor.imageEditor.aspectRatio.wide"
														defaultMessage="Wide 16:9"
													/>
												</DropdownItem>
											</DropdownItemGroup>
										</DropdownMenu>
										<Button
											onClick={rotateRight}
											isDisabled={!isImageReady}
											testId="image-editor-rotate-right-btn"
											appearance="subtle"
										>
											<RotateIcon label='rotate right button' isDisabled={!isImageReady} />
										</Button>
										<Button
											onClick={flipVertical}
											isDisabled={!isImageReady}
											testId="image-editor-flip-vertical-btn"
											appearance="subtle"
										>
											<FlipVerticalIcon label='flip vertical button' isDisabled={!isImageReady} />
										</Button>
										<Button
											onClick={flipHorizontal}
											isDisabled={!isImageReady}
											testId="image-editor-flip-horizontal-btn"
											appearance="subtle"
										>
											<FlipHorizontalIcon label='flip horizontal button' isDisabled={!isImageReady} />
										</Button>
									</div>
									<div>
										<Button appearance="subtle" onClick={onClose}>
											<FormattedMessage id="editor.imageEditor.cancel" defaultMessage="Cancel" />
										</Button>
										<Button appearance="primary" onClick={handleSave} isDisabled={!isImageReady}>
											<FormattedMessage id="editor.imageEditor.done" defaultMessage="Done" />
										</Button>
									</div>
								</div>
							</ModalFooter>
						</Modal>
					)}
				</ModalTransition>
			</AtlassianProvider>
		</IntlProvider>
	);
};
