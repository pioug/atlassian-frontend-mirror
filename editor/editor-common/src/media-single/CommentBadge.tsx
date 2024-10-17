/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import debounce from 'lodash/debounce';
import type { IntlShape } from 'react-intl-next';

import CustomThemeButton from '@atlaskit/button/custom-theme-button';
import { akEditorUnitZIndex } from '@atlaskit/editor-shared-styles';
import CommentIcon from '@atlaskit/icon/core/comment';
import LegacyCommentIcon from '@atlaskit/icon/glyph/comment';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { commentMessages as messages } from '../media';

const commentBadgeWrapper = css({
	position: 'absolute',
	// closest parent element with position relative is .resizer-hover-zone, which includes 10px padding
	right: '2px',
	top: '2px',
	borderRadius: '3px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	zIndex: akEditorUnitZIndex * 10,
});

const commentBadgeEditorOverrides = (badgeOffsetRight?: string) =>
	css({
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		right: badgeOffsetRight,
		zIndex: 100,
	});

export const getBadgeSize = (width?: number, height?: number) => {
	// width is the original width of image, not resized or currently rendered to user. Defaulting to medium for now
	return (width && width < 70) || (height && height < 70) ? 'small' : 'medium';
};

export type CommentBadgeProps = {
	intl: IntlShape;
	width?: number;
	height?: number;
	status?: 'default' | 'entered' | 'active';
	mediaSingleElement?: HTMLElement | null;
	onClick: (e: React.MouseEvent) => void;
	onMouseEnter?: (e: React.MouseEvent) => void;
	onMouseLeave?: (e: React.MouseEvent) => void;
	isEditor?: boolean;
	isDrafting?: boolean;
	badgeOffsetRight?: string;
};

export const CommentBadge = forwardRef<HTMLDivElement, CommentBadgeProps>(
	(
		{
			intl,
			width,
			height,
			status = 'default',
			mediaSingleElement,
			onClick,
			onMouseEnter,
			onMouseLeave,
			badgeOffsetRight,
		},
		ref,
	) => {
		const [badgeSize, setBadgeSize] = useState<'medium' | 'small'>(getBadgeSize(width, height));
		const title = intl.formatMessage(messages.viewCommentsOnMedia);

		useEffect(() => {
			const observer = new ResizeObserver(
				debounce((entries) => {
					const [entry] = entries;
					const { width, height } = entry.contentRect;
					setBadgeSize(getBadgeSize(width, height));
				}),
			);

			if (mediaSingleElement instanceof HTMLElement) {
				observer.observe(mediaSingleElement);
			}
			return () => {
				observer.disconnect();
			};
		}, [mediaSingleElement]);

		const badgeDimensions = badgeSize === 'medium' ? '24px' : '16px';

		const colourToken = useMemo(() => {
			switch (status) {
				case 'active':
					return token('color.background.accent.yellow.subtlest.pressed', '#F5CD47');
				case 'entered':
					return token('color.background.accent.yellow.subtlest.hovered', '#F8E6A0');
				default:
					return token('color.background.accent.yellow.subtlest', '#FFF7D6');
			}
		}, [status]);

		return (
			<div
				ref={ref}
				css={
					badgeOffsetRight
						? [
								commentBadgeWrapper,
								// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								commentBadgeEditorOverrides(badgeOffsetRight),
							]
						: commentBadgeWrapper
				}
				// This is needed so that mediaWrapperStyle in editor/editor-common/src/ui/MediaSingle/styled.tsx
				// can target the correct div
				data-comment-badge="true"
			>
				<Tooltip position="top" content={title}>
					{/* TODO: (from codemod) CustomThemeButton will be deprecated. Please consider migrating to Pressable or Anchor Primitives with custom styles. */}
					<CustomThemeButton
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: badgeDimensions,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: badgeDimensions,
							background: colourToken,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							display: 'flex',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							justifyContent: 'center',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							alignItems: 'center',
						}}
						onClick={onClick}
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
						iconAfter={
							<CommentIcon
								label={title}
								spacing="spacious"
								color="currentColor"
								LEGACY_size={badgeSize}
								LEGACY_fallbackIcon={LegacyCommentIcon}
							/>
						}
					/>
				</Tooltip>
			</div>
		);
	},
);
