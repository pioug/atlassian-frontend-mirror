/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useEffect, useRef, useState, type ChangeEventHandler } from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import Button from '@atlaskit/button/new';
import UploadIcon from '@atlaskit/icon/core/upload';
import FeatureGates from '@atlaskit/feature-gate-js-client';
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

const hasFilesInTransfer = (dataTransfer: DataTransfer | null): boolean =>
	!!dataTransfer?.types && Array.from(dataTransfer.types).includes('Files');

const isEventWithinElement = (event: DragEvent, element: HTMLElement): boolean => {
	const rect = element.getBoundingClientRect();
	return (
		event.clientX >= rect.left &&
		event.clientX <= rect.right &&
		event.clientY >= rect.top &&
		event.clientY <= rect.bottom
	);
};

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
	transitionDuration: token('motion.duration.short', '0.15s'),
	transitionTimingFunction: token('motion.easing.out.practical', 'ease'),
});

const dropzoneActive = css({
	backgroundColor: token('color.background.selected.hovered'),
	borderColor: token('color.border.selected'),
});

const previewImageStyles = css({
	maxHeight: '130px',
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
		if (
			!element ||
			!FeatureGates.getExperimentValue(
				'platform_teamoji_26_refresh_emoji_picker',
				'isEnabled',
				false,
			)
		) {
			return;
		}

		const suppressNativeFileDrop = (event: DragEvent): boolean => {
			if (!hasFilesInTransfer(event.dataTransfer)) {
				return false;
			}
			event.preventDefault();
			event.stopPropagation();
			return true;
		};

		const onWindowFileDrag = (event: DragEvent) => {
			if (!hasFilesInTransfer(event.dataTransfer)) {
				return;
			}

			const isOverDropzone = isEventWithinElement(event, element);
			if (isOverDropzone) {
				suppressNativeFileDrop(event);
			}

			if (!isDropDisabled) {
				setIsDragging(isOverDropzone);
			}
		};

		const onWindowFileDragLeave = (event: DragEvent) => {
			if (!hasFilesInTransfer(event.dataTransfer) || event.relatedTarget) {
				return;
			}
			setIsDragging(false);
		};

		const onWindowFileDrop = (event: DragEvent) => {
			if (!hasFilesInTransfer(event.dataTransfer) || !isEventWithinElement(event, element)) {
				return;
			}
			suppressNativeFileDrop(event);
			setIsDragging(false);
			if (!isDropDisabled) {
				handleFileDrop(Array.from(event.dataTransfer?.files ?? []));
			}
		};

		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		element.addEventListener('dragenter', suppressNativeFileDrop);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		element.addEventListener('dragover', suppressNativeFileDrop);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		element.addEventListener('drop', suppressNativeFileDrop);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		window.addEventListener('dragenter', onWindowFileDrag, true);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		window.addEventListener('dragover', onWindowFileDrag, true);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		window.addEventListener('dragleave', onWindowFileDragLeave, true);
		// eslint-disable-next-line @atlaskit/design-system/no-direct-use-of-web-platform-drag-and-drop
		window.addEventListener('drop', onWindowFileDrop, true);

		const cleanupDropTarget = dropTargetForExternal({
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

		return () => {
			element.removeEventListener('dragenter', suppressNativeFileDrop);
			element.removeEventListener('dragover', suppressNativeFileDrop);
			element.removeEventListener('drop', suppressNativeFileDrop);
			window.removeEventListener('dragenter', onWindowFileDrag, true);
			window.removeEventListener('dragover', onWindowFileDrag, true);
			window.removeEventListener('dragleave', onWindowFileDragLeave, true);
			window.removeEventListener('drop', onWindowFileDrop, true);
			cleanupDropTarget();
		};
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

	if (
		FeatureGates.getExperimentValue('platform_teamoji_26_refresh_emoji_picker', 'isEnabled', false)
	) {
		return (
			<div
				ref={dropzoneRef}
				css={[dropzone, isDragging && dropzoneActive]}
				data-testid={dropzoneTestId}
				data-dragging={isDragging ? 'true' : undefined}
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
