/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';
import { IntlProvider } from 'react-intl-next';

import AtlassianProvider from '@atlaskit/app-provider';
import Button from '@atlaskit/button/new';
import { cssMap } from '@atlaskit/css';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import type { ErrorReporter } from '@atlaskit/editor-common/error-reporter';
import { mediaEditingMessages } from '@atlaskit/editor-common/messages';
import CheckMarkIcon from '@atlaskit/icon/core/check-mark';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import Modal, { ModalBody, ModalFooter, ModalTransition } from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { Cropper } from './Cropper';
import { FlipHorizontalIcon } from './icons/FlipHorizontalIcon';
import { FlipVerticalIcon } from './icons/FlipVerticalIcon';
import { RatioIcon } from './icons/RatioIcon';
import { RotateIcon } from './icons/RotateIcon';
import { useImageEditor } from './useImageEditor';

interface ImageEditModalProps {
	errorReporter?: ErrorReporter;
	imageUrl?: string;
	isOpen: boolean;
	onClose: () => void;
	onSave: (imageData: Blob, width: number, height: number) => void;
}

const imageWrapper = css({
	height: '100%',
	width: '100%',
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
});

const cropper = css({
	maxWidth: '100%',
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

const ratioSelect = css({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const dropdownItemGroup = css({
	minWidth: '200px',
});

const btnGroupStyle = cssMap({
	box: {
		display: 'flex',
		gap: token('space.100', '8px'),
	},
});

const aspectRatioLabelMap: Record<string, keyof typeof mediaEditingMessages> = {
	original: 'aspectRatioSelectionOriginal',
	custom: 'aspectRatioSelectionCustom',
	square: 'aspectRatioSelectionSquare',
	circle: 'aspectRatioSelectionCircle',
	landscape: 'aspectRatioSelectionLandscape',
	portrait: 'aspectRatioSelectionPortrait',
	wide: 'aspectRatioSelectionWide',
};

export const ImageEditor = ({
	imageUrl,
	isOpen,
	onClose,
	onSave,
	errorReporter,
}: ImageEditModalProps) => {
	const {
		cropperRef,
		doneButtonRef,
		isImageReady,
		setIsImageReady,
		currentAspectRatio,
		aspectRatioSelection,
		flipHorizontal,
		flipVertical,
		handleSave,
		setSelectionArea,
		formatMessage,
		rotateRight,
	} = useImageEditor();

	return (
		<IntlProvider locale="en">
			<AtlassianProvider>
				<ModalTransition>
					{isOpen && (
						<Modal
							onClose={onClose}
							height={800}
							width="x-large"
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
											aspectRatio={currentAspectRatio}
											isCircle={aspectRatioSelection === 'circle'}
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
													isSelected={props.isSelected}
													onClick={props.onClick}
													onFocus={props.onFocus}
													onBlur={props.onBlur}
													aria-expanded={props['aria-expanded']}
													aria-haspopup={props['aria-haspopup']}
													aria-controls={props['aria-controls']}
													testId={props.testId}
												>
													<div css={ratioBtn}>
														<RatioIcon
															label="change aspect ratio button"
															isDisabled={!isImageReady}
														/>
														{aspectRatioSelection &&
															formatMessage(
																mediaEditingMessages[aspectRatioLabelMap[aspectRatioSelection]],
															)}
														<ChevronDownIcon label="" size="small" />
													</div>
												</Button>
											)}
										>
											<div css={dropdownItemGroup}>
												<DropdownItemGroup>
													{(['original', 'custom'] as const).map((item) => (
														<DropdownItem
															key={item}
															onClick={() => {
																setSelectionArea(item);
															}}
														>
															<div css={ratioSelect}>
																{formatMessage(mediaEditingMessages[aspectRatioLabelMap[item]])}
																{aspectRatioSelection === item && (
																	<CheckMarkIcon label="selected" />
																)}
															</div>
														</DropdownItem>
													))}
												</DropdownItemGroup>
												<DropdownItemGroup hasSeparator>
													{(['square', 'circle', 'landscape', 'portrait', 'wide'] as const).map(
														(item) => (
															<DropdownItem
																key={item}
																onClick={() => {
																	setSelectionArea(item);
																}}
															>
																<div css={ratioSelect}>
																	{formatMessage(
																		mediaEditingMessages[
																			`${item}Button` as keyof typeof mediaEditingMessages
																		],
																	)}
																	{aspectRatioSelection === item && (
																		<CheckMarkIcon label="selected" />
																	)}
																</div>
															</DropdownItem>
														),
													)}
												</DropdownItemGroup>
											</div>
										</DropdownMenu>
										<Button
											onClick={() => {
												rotateRight();
												setSelectionArea('original');
											}}
											isDisabled={!isImageReady}
											testId="image-editor-rotate-right-btn"
											appearance="subtle"
										>
											<RotateIcon label="rotate right button" isDisabled={!isImageReady} />
										</Button>
										<Button
											onClick={flipVertical}
											isDisabled={!isImageReady}
											testId="image-editor-flip-vertical-btn"
											appearance="subtle"
										>
											<FlipVerticalIcon label="flip vertical button" isDisabled={!isImageReady} />
										</Button>
										<Button
											onClick={flipHorizontal}
											isDisabled={!isImageReady}
											testId="image-editor-flip-horizontal-btn"
											appearance="subtle"
										>
											<FlipHorizontalIcon
												label="flip horizontal button"
												isDisabled={!isImageReady}
											/>
										</Button>
									</div>
									<Box xcss={btnGroupStyle.box}>
										<Button appearance="subtle" onClick={onClose}>
											{formatMessage(mediaEditingMessages.cancelButton)}
										</Button>
										<Button
											appearance="primary"
											onClick={() => handleSave(onSave, onClose, errorReporter)}
											isDisabled={!isImageReady}
											ref={doneButtonRef}
										>
											{formatMessage(mediaEditingMessages.doneButton)}
										</Button>
									</Box>
								</div>
							</ModalFooter>
						</Modal>
					)}
				</ModalTransition>
			</AtlassianProvider>
		</IntlProvider>
	);
};
