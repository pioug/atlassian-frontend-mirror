/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { Fragment, type JSX, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { cssMap } from '@atlaskit/css';
import Heading from '@atlaskit/heading/heading';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import Toggle from '@atlaskit/toggle/toggle';
import { token } from '@atlaskit/tokens';

const fileUploadStyles = cssMap({
	container: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'flex-start',
		width: '100%',
	},
	previewWrapper: {
		position: 'relative',
		flex: 1,
		minWidth: 0,
		height: '64px',
		borderRadius: token('radius.small'),
		overflow: 'hidden',
		border: `${token('border.width')} solid ${token('color.border')}`,
		backgroundColor: token('color.background.neutral.subtle'),
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		cursor: 'pointer',
	},
	preview: {
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	hoverOverlayBg: {
		position: 'absolute',
		inset: 0,
	},
	hoverBanner: {
		color: token('color.text.inverse'),
		paddingInline: token('space.100'),
		paddingBlock: token('space.050'),
		borderRadius: token('radius.small'),
		position: 'relative',
		zIndex: 1,
	},
	placeholder: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: token('space.050'),
		color: token('color.text.subtle'),
		textAlign: 'center',
		paddingBlock: token('space.100'),
		paddingInline: token('space.100'),
	},
	buttonsContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.050'),
		height: '64px',
		justifyContent: 'flex-start',
		flexShrink: 0,
	},
});

const previewImageBaseStyles = css({
	width: 'auto',
	maxWidth: '100%',
	height: 'auto',
	maxHeight: '100%',
	filter: 'none',
	objectFit: 'cover',
	transition: 'filter 0.2s',
});

const hoverOverlayBaseStyles = css({
	display: 'flex',
	position: 'absolute',
	inset: 0,
	alignItems: 'flex-end',
	justifyContent: 'center',
	opacity: 0,
	paddingBlockEnd: token('space.050'),
	pointerEvents: 'none',
	transition: 'opacity 0.2s',
});

export interface FileUploadButtonProps {
	label: string;
	isEnabled: boolean;
	onToggleChange: (enabled: boolean) => void;
	onFileUpload: (imageUrl: string) => void;
	uploadButtonLabel: string;
	imageUrl?: string;
	onImageRemove?: () => void;
}

export const FileUploadButton = ({
	label,
	isEnabled,
	onToggleChange,
	onFileUpload,
	uploadButtonLabel,
	imageUrl,
	onImageRemove,
}: FileUploadButtonProps): JSX.Element => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				onFileUpload(imageUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handlePreviewClick = () => {
		if (imageUrl) {
			handleUploadClick();
		}
	};

	return (
		<Stack space="space.100">
			<Inline alignBlock="center" space="space.100">
				<Heading as="h4" size="small">
					{label}
				</Heading>
				<Toggle isChecked={isEnabled} onChange={() => onToggleChange(!isEnabled)} />
			</Inline>
			<Box xcss={fileUploadStyles.container}>
				<Pressable
					onClick={handlePreviewClick}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					xcss={fileUploadStyles.previewWrapper}
				>
					{imageUrl ? (
						<Fragment>
							<Box xcss={fileUploadStyles.preview}>
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
								<img
									src={imageUrl}
									alt="Preview"
									css={previewImageBaseStyles}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ filter: isHovered ? 'grayscale(100%)' : 'none' }}
								/>
							</Box>
							<div
								css={hoverOverlayBaseStyles}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ opacity: isHovered ? 1 : 0 }}
							>
								<Box
									xcss={fileUploadStyles.hoverOverlayBg}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
								/>
								<Box
									xcss={fileUploadStyles.hoverBanner}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
								>
									<Text size="small" color="color.text.inverse">
										Change image
									</Text>
								</Box>
							</div>
						</Fragment>
					) : (
						<Box xcss={fileUploadStyles.placeholder}>
							<Text size="small" color="color.text.subtle">
								{uploadButtonLabel}
							</Text>
						</Box>
					)}
				</Pressable>
				<Box xcss={fileUploadStyles.buttonsContainer}>
					<Button onClick={handleUploadClick} appearance="default">
						{imageUrl ? 'Change image' : uploadButtonLabel}
					</Button>
					{imageUrl && onImageRemove && (
						<Button onClick={onImageRemove} appearance="subtle">
							Remove image
						</Button>
					)}
				</Box>
			</Box>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				onChange={handleFileUpload}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ display: 'none' }}
			/>
		</Stack>
	);
};
