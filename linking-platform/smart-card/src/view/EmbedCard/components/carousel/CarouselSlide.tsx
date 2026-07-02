/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import Image from '@atlaskit/image';
import { Box, Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';

import type { CarouselSize } from './types';

const styles = cssMap({
	columnImage: {
		flex: '1 1 240px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
		backgroundColor: token('color.background.accent.blue.subtler'),
	},
	columnContent: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		flex: '1 1 200px',
		paddingTop: token('space.500'),
		paddingRight: token('space.500'),
		paddingBottom: token('space.500'),
		paddingLeft: token('space.500'),
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	columnContentCompact: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	dot: {
		width: '6px',
		height: '6px',
		borderRadius: token('radius.full'),
		backgroundColor: token('color.background.neutral'),
		transitionDuration: '200ms',
		transitionProperty: 'background-color',
		transitionTimingFunction: 'ease',
		pointerEvents: 'none',
	},
	dotActive: {
		backgroundColor: token('color.background.selected.bold'),
	},
	dotPassable: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '16px',
		height: '16px',
		backgroundColor: token('color.background.neutral.subtle'),
		borderRadius: token('radius.full'),
		paddingTop: token('space.0'),
		paddingRight: token('space.0'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.0'),
	},
	icon: {
		flexShrink: 0,
		width: '24px',
		height: '24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconImage: {
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	image: {
		width: '100%',
		maxHeight: '220px',
		objectFit: 'contain',
		objectPosition: 'center center',
		display: 'block',
	},
	rowButton: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: token('space.100'),
		alignItems: 'center',
	},
	rowButtonCompact: {
		width: '100%',
	},
	rowDot: {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.0'),
		alignItems: 'center',
	},
	rowIcon: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
	},
	slide: {
		display: 'flex',
		flexWrap: 'wrap',
		width: '100%',
		height: '100%',
		alignItems: 'stretch',
		boxSizing: 'border-box',
		overflow: 'auto',
	},
});

type CarouselSlideProps = {
	/** Resolved description string (already injected with provider name) */
	description: string;
	/** Provider icon — a React element or an image URL */
	icon?: React.ReactNode | string;
	/** Alt for the icon, e.g. "Figma" */
	iconLabel?: string;
	/** Large hero image — a React element (e.g. SVG/img) or a URL string */
	image: React.ReactNode | string;
	/** Called when the user clicks a dot indicator to jump to that slide index */
	onDotClick?: (index: number) => void;
	/** Called when the user clicks the secondary "See next" button; omit on last slide */
	onNextClick?: () => void;
	/** Called when the user clicks the primary connect button */
	onPrimaryButtonClick?: () => void;
	/** Text label for the connect button (e.g. "Connect to Figma") */
	primaryButtonLabel: string;
	/**
	 * Layout size bucket derived from the carousel container's measured dimensions.
	 * Controls which elements are shown at different card sizes.
	 */
	size: CarouselSize;
	/** 0-based index of this slide */
	slideIndex: number;
	/** testId prefix */
	testId?: string;
	/** Resolved title string (already injected with provider name) */
	title: string;
	/** Total number of slides (for the dot indicators) */
	totalSlides: number;
};

const CarouselSlide = ({
	icon,
	iconLabel,
	title,
	description,
	image,
	primaryButtonLabel,
	onPrimaryButtonClick,
	onDotClick,
	onNextClick,
	slideIndex,
	totalSlides,
	size,
	testId = 'embed-card-teaser-slide',
}: CarouselSlideProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const isCompact = size !== 'full';
	const showNavigation = totalSlides > 1;

	const renderedIcon =
		icon == null ? null : typeof icon === 'string' ? (
			<Box xcss={styles.icon}>
				<Image css={styles.iconImage} src={icon} alt={iconLabel} />
			</Box>
		) : (
			<Box xcss={styles.icon}>{icon}</Box>
		);

	const renderedImage =
		image == null ? null : typeof image === 'string' ? (
			<Image css={styles.image} src={image} alt={title} />
		) : (
			image
		);

	return (
		<Box xcss={styles.slide} testId={testId}>
			<Box xcss={cx(styles.columnContent, isCompact && styles.columnContentCompact)}>
				{isCompact && (
					<Box xcss={cx(styles.rowButton, styles.rowButtonCompact)}>
						<Button
							appearance="primary"
							onClick={onPrimaryButtonClick}
							shouldFitContainer
							testId={`${testId}-connect-compact`}
						>
							{primaryButtonLabel}
						</Button>
					</Box>
				)}

				{renderedIcon && <Box xcss={styles.rowIcon}>{renderedIcon}</Box>}

				<Box>
					<Heading size="medium" testId={`${testId}-title`}>
						{title}
					</Heading>
				</Box>

				<Box>
					<Text testId={`${testId}-description`}>{description}</Text>
				</Box>

				<Box xcss={styles.rowButton}>
					{!isCompact && (
						<Button
							appearance="primary"
							onClick={onPrimaryButtonClick}
							testId={`${testId}-connect`}
						>
							{primaryButtonLabel}
						</Button>
					)}

					{showNavigation && onNextClick && (
						<Button appearance="subtle" onClick={onNextClick} testId={`${testId}-next`}>
							{formatMessage(messages.connect_link_account_embed_teaser_button_next)}
						</Button>
					)}
					{showNavigation && (
						<Box
							xcss={styles.rowDot}
							role="group"
							aria-label={formatMessage(messages.connect_link_account_embed_teaser_dot_row_label)}
						>
							{Array.from({ length: totalSlides }, (_, i) => (
								<Pressable
									key={i}
									xcss={styles.dotPassable}
									onClick={() => onDotClick?.(i)}
									aria-label={formatMessage(messages.connect_link_account_embed_teaser_dot_label, {
										index: i + 1,
										total: totalSlides,
									})}
									aria-current={i === slideIndex ? 'true' : undefined}
									testId={`${testId}-dot-${i}`}
								>
									<Box xcss={cx(styles.dot, i === slideIndex && styles.dotActive)} />
								</Pressable>
							))}
						</Box>
					)}
				</Box>
			</Box>

			{!isCompact && (
				<Box xcss={styles.columnImage} testId={`${testId}-image-panel`}>
					{renderedImage}
				</Box>
			)}
		</Box>
	);
};

export default CarouselSlide;
