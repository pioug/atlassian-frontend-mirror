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
import { Pressable } from '@atlaskit/primitives/compiled/pressable';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';

import { ToggleWithLabel } from './toggle-with-label';
import type { NavThemingMode } from './types';
import { calculateAccessibleForegroundColor } from './utils/color-utils';

const logoUploadStyles = cssMap({
	container: {
		display: 'flex',
		gap: token('space.100'),
		alignItems: 'flex-start',
		width: '100%',
	},
	previewWrapper: {
		position: 'relative',
		flex: '1',
		minWidth: 0,
		height: '64px',
		borderRadius: token('radius.small'),
		overflow: 'hidden',
		border: `${token('border.width')} solid ${token('color.border')}`,
		display: 'flex',
		alignItems: 'stretch',
		cursor: 'pointer',
	},
	previewSection: {
		flex: '1',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingBlock: token('space.100'),
		paddingInline: token('space.050'),
		position: 'relative',
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
	objectFit: 'contain',
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

const monochromeWrapperStyles = css({
	display: 'inline-block',
	maxWidth: '100%',
	maxHeight: '100%',
	position: 'relative',
	color: 'currentColor',
});

const monochromeImageStyles = css({
	display: 'block',
	width: 'auto',
	maxWidth: '100%',
	height: 'auto',
	maxHeight: '100%',
	opacity: 0,
});

const monochromeMaskStyles = css({
	width: '100%',
	height: '100%',
	position: 'absolute',
	backgroundColor: 'currentColor',
	insetBlockEnd: 0,
	insetBlockStart: 0,
	insetInlineEnd: 0,
	insetInlineStart: 0,
	maskPosition: 'center',
	maskRepeat: 'no-repeat',
	maskSize: 'contain',
	WebkitMaskPosition: 'center',
	WebkitMaskRepeat: 'no-repeat',
	WebkitMaskSize: 'contain',
});

export interface LogoUploadProps {
	logoUrl?: string;
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	logoMonochrome?: boolean;
	brandColor?: string;
	navThemingMode?: NavThemingMode;
	onLogoUpload: (imageUrl: string) => void;
	onLogoRemove: () => void;
	onMonochromeChange?: (isMonochrome: boolean) => void;
}

export const LogoUpload = ({
	logoUrl,
	logoMonochrome,
	brandColor,
	navThemingMode,
	onLogoUpload,
	onLogoRemove,
	onMonochromeChange,
}: LogoUploadProps): JSX.Element => {
	const logoInputRef = useRef<HTMLInputElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const imageUrl = e.target?.result as string;
				onLogoUpload(imageUrl);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleLogoUploadClick = () => {
		logoInputRef.current?.click();
	};

	const handlePreviewClick = () => {
		if (logoUrl) {
			handleLogoUploadClick();
		}
	};

	// Calculate foreground colors for each section
	const surfaceBg = token('elevation.surface');
	const subtleBg = token('color.background.neutral.subtle');
	const brandBg = brandColor || '#0052CC'; // Default brand color if not provided
	const brandFg = calculateAccessibleForegroundColor(brandBg);

	// Automatically use monochrome for brand color section when Bold theming is selected
	// When bold is selected, always show monochrome in preview regardless of logoMonochrome setting
	const shouldShowMonochromeInBrandSection = navThemingMode === 'bold' || logoMonochrome;

	// Only show toggle when Bold (colourful) mode is selected
	const shouldShowToggle = navThemingMode === 'bold';

	return (
		<Stack space="space.100">
			<Heading as="h4" size="xsmall">
				Logo
			</Heading>
			<Box xcss={logoUploadStyles.container}>
				<Pressable
					onClick={handlePreviewClick}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
					xcss={logoUploadStyles.previewWrapper}
				>
					{logoUrl ? (
						<Fragment>
							{/* Standard surface background */}
							<Box
								xcss={logoUploadStyles.previewSection}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ backgroundColor: surfaceBg }}
							>
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
								<img
									src={logoUrl}
									alt="Logo preview"
									css={previewImageBaseStyles}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ filter: isHovered ? 'grayscale(100%)' : 'none' }}
								/>
							</Box>
							{/* Subtle background */}
							<Box
								xcss={logoUploadStyles.previewSection}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ backgroundColor: subtleBg }}
							>
								{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
								<img
									src={logoUrl}
									alt="Logo preview"
									css={previewImageBaseStyles}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ filter: isHovered ? 'grayscale(100%)' : 'none' }}
								/>
							</Box>
							{/* Brand color background */}
							<Box
								xcss={logoUploadStyles.previewSection}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ backgroundColor: brandBg }}
							>
								{shouldShowMonochromeInBrandSection ? (
									<span
										css={monochromeWrapperStyles}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
										style={{ color: brandFg }}
									>
										{/* eslint-disable-next-line @atlaskit/design-system/no-html-image */}
										<img alt="" src={logoUrl} css={monochromeImageStyles} />
										<span
											css={monochromeMaskStyles}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
											style={
												{
													maskImage: `url(${logoUrl})`,
													WebkitMaskImage: `url(${logoUrl})`,
												} as React.CSSProperties
											}
										/>
									</span>
								) : (
									/* eslint-disable-next-line @atlaskit/design-system/no-html-image */
									<img
										src={logoUrl}
										alt="Logo preview"
										css={previewImageBaseStyles}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
										style={{ filter: isHovered ? 'grayscale(100%)' : 'none' }}
									/>
								)}
							</Box>
							<div
								css={hoverOverlayBaseStyles}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ opacity: isHovered ? 1 : 0 }}
							>
								<Box
									xcss={logoUploadStyles.hoverOverlayBg}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
								/>
								<Box
									xcss={logoUploadStyles.hoverBanner}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
								>
									<Text size="small" color="color.text.inverse">
										Change logo
									</Text>
								</Box>
							</div>
						</Fragment>
					) : (
						<Box xcss={logoUploadStyles.placeholder}>
							<Text size="small" color="color.text.subtle">
								Upload logo
							</Text>
						</Box>
					)}
				</Pressable>
				<Box xcss={logoUploadStyles.buttonsContainer}>
					<Button onClick={handleLogoUploadClick} appearance="default">
						{logoUrl ? 'Change logo' : 'Upload logo'}
					</Button>
					{logoUrl && (
						<Button onClick={onLogoRemove} appearance="subtle">
							Remove logo
						</Button>
					)}
				</Box>
			</Box>
			{logoUrl && onMonochromeChange && shouldShowToggle && (
				<ToggleWithLabel
					id="logo-monochrome-toggle"
					label="Use monochrome logo"
					isChecked={logoMonochrome ?? false}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						onMonochromeChange(e.target.checked)
					}
				/>
			)}
			{/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
			<input
				ref={logoInputRef}
				type="file"
				accept="image/*"
				onChange={handleLogoUpload}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={{ display: 'none' }}
			/>
		</Stack>
	);
};
