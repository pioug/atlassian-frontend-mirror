/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useMemo } from 'react';

import { useIntl } from 'react-intl';

import Button from '@atlaskit/button/new';
import { cssMap, cx, jsx } from '@atlaskit/css';
import Heading from '@atlaskit/heading';
import SmartLinkIcon from '@atlaskit/icon/core/smart-link';
import IconTile from '@atlaskit/icon/icon-tile';
import Image from '@atlaskit/image';
import { Box, Pressable, Text } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { messages } from '../../../../messages';

import type { CarouselSize } from './types';

const styles = cssMap({
	columnImage: {
		flex: '1 1 240px',
		display: 'flex',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
		overflow: 'hidden',
		minHeight: 0,
		minWidth: 0,
		backgroundColor: token('color.background.information.subtle'),
	},
	imageContainer: {
		position: 'relative',
		width: '100%',
		height: '100%',
	},
	imageAbsolute: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
	},
	columnContent: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		flex: '1 1 200px',
		minHeight: 0,
		overflow: 'auto',
		paddingTop: token('space.500'),
		paddingRight: token('space.500'),
		paddingBottom: token('space.500'),
		paddingLeft: token('space.500'),
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	columnContentTop: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.200'),
		alignItems: 'flex-start',
		width: '100%',
	},
	columnContentBody: {
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.300'),
		alignItems: 'flex-start',
		width: '100%',
	},
	columnContentCompact: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.200'),
		paddingLeft: token('space.200'),
	},
	dot: {
		width: '8px',
		height: '8px',
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
	rowButtonNavGroup: {
		display: 'flex',
		flexDirection: 'row',
		gap: token('space.100'),
		alignItems: 'center',
		flexShrink: 0,
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
		flexWrap: 'nowrap',
		width: '100%',
		height: '100%',
		alignItems: 'stretch',
		boxSizing: 'border-box',
		overflow: 'hidden',
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
	/** Called when the user clicks the secondary "Back" button; omit on first slide */
	onBackClick?: () => void;
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
	iconLabel = '',
	title,
	description,
	image,
	primaryButtonLabel,
	onPrimaryButtonClick,
	onBackClick,
	onDotClick,
	onNextClick,
	slideIndex,
	totalSlides,
	size,
	testId = 'embed-card-carousel-slide',
}: CarouselSlideProps): React.JSX.Element => {
	const { formatMessage } = useIntl();

	const isCompact = size !== 'full';
	const showPrimaryButton = typeof onPrimaryButtonClick === 'function';
	const showNavigation = totalSlides > 1;

	const renderedIcon = useMemo(() => {
		if (typeof icon === 'string') {
			return (
				<Box xcss={styles.icon}>
					<Image css={styles.iconImage} src={icon} alt={iconLabel} />
				</Box>
			);
		}

		if (icon) {
			return <Box xcss={styles.icon}>{icon}</Box>;
		}

		return (
			<IconTile
				appearance="blue"
				icon={SmartLinkIcon}
				label={iconLabel}
				size="small"
				testId="embed-card-fallback-icon"
			/>
		);
	}, [icon, iconLabel]);

	const renderedImage =
		image == null ? null : typeof image === 'string' ? (
			<Image css={styles.image} src={image} alt={title} />
		) : (
			image
		);

	return (
		<Box xcss={styles.slide} testId={testId}>
			<Box xcss={cx(styles.columnContent, isCompact && styles.columnContentCompact)}>
				{/* Top section: all content except dots */}
				<Box xcss={styles.columnContentTop}>
					{showPrimaryButton && isCompact && (
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

					{/* Description + button group: space.300 between them */}
					<Box xcss={styles.columnContentBody}>
						<Box>
							<Text testId={`${testId}-description`}>{description}</Text>
						</Box>

						{((showPrimaryButton && !isCompact) ||
							(showNavigation && (onNextClick || onBackClick))) && (
							<Box xcss={styles.rowButton}>
								{showPrimaryButton && !isCompact && (
									<Button
										appearance="primary"
										onClick={onPrimaryButtonClick}
										testId={`${testId}-connect`}
									>
										{primaryButtonLabel}
									</Button>
								)}

								{showNavigation && (onBackClick || onNextClick) && (
									<Box xcss={styles.rowButtonNavGroup}>
										{onBackClick && (
											<Button appearance="subtle" onClick={onBackClick} testId={`${testId}-back`}>
												{formatMessage(messages.connect_link_account_embed_carousel_button_back)}
											</Button>
										)}
										{onNextClick && (
											<Button appearance="subtle" onClick={onNextClick} testId={`${testId}-next`}>
												{formatMessage(messages.connect_link_account_embed_carousel_button_next)}
											</Button>
										)}
									</Box>
								)}
							</Box>
						)}
					</Box>
				</Box>

				{/* Bottom section: dot indicators pinned to bottom via space-between */}
				{showNavigation && (
					<Box
						xcss={styles.rowDot}
						role="group"
						aria-label={formatMessage(messages.connect_link_account_embed_carousel_dot_row_label)}
					>
						{Array.from({ length: totalSlides }, (_, i) => (
							<Pressable
								key={i}
								xcss={styles.dotPassable}
								onClick={() => onDotClick?.(i)}
								aria-label={formatMessage(messages.connect_link_account_embed_carousel_dot_label, {
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

			{!isCompact && (
				<Box xcss={styles.columnImage} testId={`${testId}-image-panel-${slideIndex}`}>
					<Box xcss={styles.imageContainer}>
						<Box xcss={styles.imageAbsolute}>{renderedImage}</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default CarouselSlide;
