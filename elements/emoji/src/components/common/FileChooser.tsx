/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState, type ChangeEventHandler } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import Button from '@atlaskit/button/new';
import UploadIcon from '@atlaskit/icon/core/upload';
import { fg } from '@atlaskit/platform-feature-flags';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import { containsFiles, getFiles } from '@atlaskit/pragmatic-drag-and-drop/external/file';

export interface Props {
	accept?: string;
	ariaDescribedBy?: string;
	isDisabled?: boolean;
	isDropDisabled?: boolean;
	label: string;
	onChange?: ChangeEventHandler<any>;
	onClick?: () => void;
	previewAlt?: string;
	previewImage?: string;
}

export const chooseFileButtonTestId = 'choose-file-button';
export const fileUploadInputTestId = 'file-upload';
export const dropzoneTestId = 'file-dropzone';

const dropzone = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: token('space.100'),
	height: '170px',
	paddingRight: token('space.150'),
	paddingLeft: token('space.150'),
	borderWidth: token('border.width'),
	borderStyle: 'dashed',
	borderColor: token('color.border'),
	borderRadius: token('radius.medium'),
	backgroundColor: token('elevation.surface.sunken'),
	cursor: 'pointer',
	transitionProperty: 'background-color, border-color',
	transitionDuration: '0.15s',
	transitionTimingFunction: 'ease',
});

const dropzoneActive = css({
	backgroundColor: token('color.background.selected.hovered'),
	borderColor: token('color.border.selected'),
});

const previewImageStyles = css({
	maxHeight: '80px',
	maxWidth: '100%',
	objectFit: 'contain',
});

const FileChooser = (props: Props): React.JSX.Element => {
	const {
		accept,
		ariaDescribedBy,
		isDisabled,
		isDropDisabled,
		label,
		onChange,
		onClick,
		previewImage,
		previewAlt,
	} = props;
	const filePickerRef = useRef<HTMLInputElement>(null);
	const fileButtonRef = useRef<HTMLButtonElement>(null);
	const dropzoneRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleOnChooseFile = () => {
		if (!filePickerRef.current) {
			return;
		}

		if (onClick) {
			onClick();
		}
		filePickerRef.current.click();
		fileButtonRef.current?.focus();
	};

	const handleFileDrop = useCallback(
		(files: File[]) => {
			if (!onChange || !files.length) {
				return;
			}
			const dataTransfer = new DataTransfer();
			files.forEach((file) => dataTransfer.items.add(file));
			const syntheticEvent = {
				target: { files: dataTransfer.files },
			} as unknown as React.ChangeEvent<HTMLInputElement>;
			onChange(syntheticEvent);
		},
		[onChange],
	);

	useEffect(() => {
		const element = dropzoneRef.current;
		if (!element || !fg('platform_emoji_picker_refresh')) {
			return;
		}

		return dropTargetForExternal({
			element,
			canDrop: containsFiles,
			onDragEnter: () => {
				if (!isDropDisabled) {
					setIsDragging(true);
				}
			},
			onDragLeave: () => setIsDragging(false),
			onDrop: ({ source }) => {
				setIsDragging(false);
				if (!isDropDisabled) {
					const files = getFiles({ source });
					handleFileDrop(files);
				}
			},
		});
	}, [isDropDisabled, handleFileDrop]);

	const hiddenInput = (
		<input
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="emojiUploadFileInput"
			ref={filePickerRef}
			onChange={onChange}
			type="file"
			accept={accept}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ display: 'none' }}
			data-testid={fileUploadInputTestId}
		/>
	);

	if (fg('platform_emoji_picker_refresh')) {
		return (
			<div
				ref={dropzoneRef}
				css={[dropzone, isDragging && dropzoneActive]}
				data-testid={dropzoneTestId}
				role="region"
				aria-label={label}
			>
				{previewImage ? (
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					<img src={previewImage} alt={previewAlt} css={previewImageStyles} />
				) : (
					<Button
						onClick={handleOnChooseFile}
						isDisabled={isDisabled}
						appearance="subtle"
						iconBefore={UploadIcon}
						aria-describedby={ariaDescribedBy}
						testId={chooseFileButtonTestId}
						ref={fileButtonRef}
					>
						{label}
					</Button>
				)}
				{hiddenInput}
			</div>
		);
	}

	return (
		<span>
			<Button
				onClick={handleOnChooseFile}
				isDisabled={isDisabled}
				aria-describedby={ariaDescribedBy}
				testId={chooseFileButtonTestId}
				ref={fileButtonRef}
			>
				{label}
			</Button>
			{hiddenInput}
		</span>
	);
};

export default FileChooser;
