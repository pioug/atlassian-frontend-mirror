/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type ReactNode, useState } from 'react';

// Multiline clamping requires styles outside @atlaskit/css's schema.
import { cssMap, jsx } from '@compiled/react';
import { useIntl } from 'react-intl';

import { cssMap as layoutCssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import { useThemeObserver } from '@atlaskit/tokens/use-theme-observer';

import { messages } from './messages';
import type { QuickInsertPreview } from './preview';
import { QuickInsertShortcut } from './QuickInsertShortcut';

const layoutStyles = layoutCssMap({
	titleRow: {
		minWidth: 0,
	},
	titleIcon: {
		alignItems: 'center',
		display: 'flex',
		flexShrink: 0,
		justifyContent: 'center',
	},
	attributionText: {
		flex: '1 1 auto',
		minWidth: 0,
		overflowWrap: 'anywhere',
	},
});

const styles = cssMap({
	// Fills an Element Browser tile stretched to its row's height, and lets long words wrap.
	root: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		minWidth: 0,
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		gap: token('space.100'),
	},
	title: {
		color: token('color.text.subtle'),
		font: token('font.heading.xsmall'),
		// Shrinks and wraps but doesn't grow, so a lozenge or shortcut stays beside the title.
		flex: '0 1 auto',
		minWidth: 0,
		overflowWrap: 'anywhere',
	},
	clampedTitle: {
		display: '-webkit-box',
		overflow: 'hidden',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 2,
	},
	description: {
		color: token('color.text'),
		display: '-webkit-box',
		font: token('font.body'),
		overflow: 'hidden',
		overflowWrap: 'anywhere',
		WebkitBoxOrient: 'vertical',
		WebkitLineClamp: 4,
	},
	unclampedDescription: {
		color: token('color.text'),
		font: token('font.body'),
		overflowWrap: 'anywhere',
	},
	disabledText: {
		color: token('color.text.disabled'),
	},
	imageArea: {
		backgroundColor: token('elevation.surface.sunken'),
		borderRadius: token('radius.small'),
		height: '120px',
		marginBlockEnd: token('space.100'),
		overflow: 'hidden',
		width: '100%',
	},
	image: {
		display: 'block',
		height: '100%',
		objectFit: 'contain',
		width: '100%',
	},
	imageHidden: {
		visibility: 'hidden',
	},
	attribution: {
		alignItems: 'center',
		color: token('color.text.subtle'),
		display: 'flex',
		gap: token('space.050'),
		// Keeps footers level across a row of tiles; a no-op where the content isn't stretched.
		marginBlockStart: 'auto',
		overflowWrap: 'anywhere',
	},
	compactAttribution: {
		font: token('font.body.small'),
	},
	attributionIcon: {
		alignItems: 'center',
		display: 'flex',
		flex: '0 0 16px',
		height: '16px',
		justifyContent: 'center',
		width: '16px',
	},
});

/**
 * The image, title, description, and attribution shared by the Quick Insert hover preview and
 * Element Browser tiles. It fills its container; callers own its width and accessible name.
 */
export const QuickInsertPreviewContent = ({
	description,
	icon,
	id,
	isDisabled = false,
	lozenge,
	preview,
	shortcut,
	shouldClampText = true,
	title,
}: {
	description?: string;
	icon?: ReactNode;
	/** Lets the slash-menu row or Element Browser tile point aria-describedby at this content. */
	id?: string;
	isDisabled?: boolean;
	lozenge?: ReactNode;
	preview: QuickInsertPreview;
	/** Shown at the end of the title row, inside this content so it is announced with the description. */
	shortcut?: string;
	shouldClampText?: boolean;
	/** Visual title only: the slash-menu row or Element Browser tile already has it as its accessible name. */
	title: ReactNode;
}): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const { colorMode } = useThemeObserver();
	const imageUrl = preview.image
		? colorMode === 'dark' && preview.image.dark
			? preview.image.dark
			: preview.image.light
		: undefined;
	const AttributionIcon = preview.attribution?.icon;
	const attributionName = preview.attribution?.name;
	const formattedAttributionName =
		typeof attributionName === 'string'
			? attributionName
			: attributionName
				? formatMessage(attributionName)
				: '';

	const titleRow = (
		<Inline alignBlock="center" space="space.100" xcss={layoutStyles.titleRow}>
			{icon && (
				<Box as="span" aria-hidden="true" xcss={layoutStyles.titleIcon}>
					{icon}
				</Box>
			)}
			{/* The row or tile is already named by the title, so only the lozenge is announced here. */}
			<span
				aria-hidden="true"
				css={[
					styles.title,
					shouldClampText && styles.clampedTitle,
					isDisabled && styles.disabledText,
				]}
			>
				{title}
			</span>
			{lozenge}
		</Inline>
	);

	return (
		<div css={styles.root} id={id}>
			{imageUrl && <PreviewImage key={imageUrl} imageUrl={imageUrl} />}
			<div css={styles.content}>
				{shortcut ? (
					<Inline alignBlock="start" space="space.100" spread="space-between">
						{titleRow}
						<QuickInsertShortcut isDisabled={isDisabled} shortcut={shortcut} />
					</Inline>
				) : (
					titleRow
				)}
				{description && (
					<div
						css={[
							shouldClampText && styles.description,
							!shouldClampText && styles.unclampedDescription,
							isDisabled && styles.disabledText,
						]}
					>
						{description}
					</div>
				)}
				{preview.attribution && (
					<div
						css={[
							styles.attribution,
							shouldClampText && styles.compactAttribution,
							isDisabled && styles.disabledText,
						]}
					>
						{AttributionIcon && (
							<span aria-hidden="true" css={styles.attributionIcon}>
								<AttributionIcon />
							</span>
						)}
						<span css={layoutStyles.attributionText}>
							<Text size="small" color={isDisabled ? 'color.text.disabled' : 'color.text.subtle'}>
								{AttributionIcon
									? formattedAttributionName
									: formatMessage(messages.previewAttributionBy, {
											name: formattedAttributionName,
										})}
							</Text>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

const PreviewImage = ({ imageUrl }: { imageUrl: string }): React.JSX.Element => {
	const [hasFailed, setHasFailed] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);

	return (
		<div css={styles.imageArea} aria-hidden="true" data-testid="quick-insert-preview-image-area">
			{!hasFailed && (
				<img
					css={[styles.image, !hasLoaded && styles.imageHidden]}
					aria-hidden="true"
					data-testid="quick-insert-hover-preview"
					// Element Browser tiles below the fold load as they scroll into view.
					loading="lazy"
					src={imageUrl}
					alt=""
					onLoad={() => setHasLoaded(true)}
					onError={() => setHasFailed(true)}
				/>
			)}
		</div>
	);
};
