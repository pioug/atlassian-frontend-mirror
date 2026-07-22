/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, memo, useCallback, useEffect, useRef, useState } from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import { cssMap, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import __noop from '@atlaskit/ds-lib/noop';
import LinkIcon from '@atlaskit/icon/core/link';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip, { type TriggerProps } from '@atlaskit/tooltip';

import { type BreadcrumbsCurrentItemProps } from '../types';

import { useBreadcrumbsSize } from './internal/use-breadcrumbs-size';
import useOverflowable from './internal/use-overflowable';

const COPY_RESET_DELAY_MS = 2000;
const ICON_WIDTH_ESTIMATE = 24;
const VAR_CURRENT_ITEM_TRUNCATION_WIDTH = '--breadcrumbs-current-item-max-width';

const unboundedStyles = unboundedCssMap({
	container: {
		display: 'inline-flex',
		alignItems: 'center',
		boxSizing: 'border-box',
		gap: token('space.050'),
		height: '1.5rem',
		paddingBlock: token('space.025'),
		borderRadius: token('radius.small'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover [data-breadcrumbs-copy-link]': {
			opacity: '1',
		},
	},
	interactiveContainer: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050'),
		boxSizing: 'border-box',
		color: token('color.text'),
		textDecoration: 'none',
		font: token('font.body'),
		'&:hover': {
			textDecoration: 'underline',
			color: token('color.text'),
		},
		'&:active': {
			color: token('color.text'),
		},
	},
	interactiveContainerMotion: {
		textDecorationLine: 'underline',
		textDecorationColor: 'transparent',
		transition: token('motion.listitem.selected'),
		'&:hover': {
			textDecorationColor: token('color.text'),
			transition: token('motion.listitem.hovered'),
		},
		'&:active': {
			transition: token('motion.listitem.pressed'),
			textDecorationColor: token('color.text'),
		},
	},
	interactiveContainerSmall: {
		font: token('font.body.small'),
	},
	interactiveContainerLegacy: {
		height: '1.5rem',
	},
	interactiveContainerWithTruncation: {
		minWidth: '0px',
		maxWidth: `var(${VAR_CURRENT_ITEM_TRUNCATION_WIDTH})`,
		flexShrink: '1',
	},
	itemWrapper: {
		display: 'flex',
		boxSizing: 'border-box',
		maxWidth: '100%',
		alignItems: 'center',
		alignSelf: 'center',
		flexDirection: 'row',
		fontFamily: token('font.family.body'),
		marginBlockEnd: token('space.0', '0px'),
		marginBlockStart: token('space.0', '0px'),
		marginInlineEnd: token('space.0', '0px'),
		marginInlineStart: token('space.0', '0px'),
		paddingBlockEnd: token('space.0', '0px'),
		paddingBlockStart: token('space.0', '0px'),
		paddingInlineEnd: token('space.0', '0px'),
		paddingInlineStart: token('space.0', '0px'),
	},
	copyButtonWrapper: {
		display: 'inline-flex',
		opacity: '0',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- data-attribute state selector
		'&[data-copied="true"]': {
			opacity: '1',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:focus-within': {
			opacity: '1',
		},
	},
	iconWrapper: {
		color: token('color.icon.subtlest'),
	},
	iconWrapperSmall: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Preserve small icon sizing without mutating the child element.
		'& svg': {
			width: '16px',
			height: '16px',
		},
	},
});

const styles = cssMap({
	iconWrapper: {
		display: 'inline-flex',
		flexShrink: '0',
		width: '24px',
		height: '24px',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden',
	},
	iconWrapperExternal: {
		marginInlineEnd: token('space.025'),
	},
	iconWrapperExternalSmall: {
		marginInlineEnd: token('space.0'),
	},
	text: {
		font: token('font.body'),
		color: token('color.text'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textSmall: {
		font: token('font.body.small'),
		color: token('color.text'),
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
	textWithTruncation: {
		minWidth: '0px',
		maxWidth: '100%',
		flexShrink: '1',
	},
});

type BreadcrumbsCurrentItemInternalProps = BreadcrumbsCurrentItemProps & {
	_overflowRef?: (el: HTMLLIElement | null) => void;
};

const BreadcrumbsCurrentItem: import('react').MemoExoticComponent<
	(props: BreadcrumbsCurrentItemInternalProps) => JSX.Element
> = memo(
	({
		text,
		href,
		elemBefore,
		iconBefore,
		truncationWidth,
		testId,
		onCopyLink,
		onTooltipShown,
		_overflowRef,
	}: BreadcrumbsCurrentItemInternalProps) => {
		const isSmall = useBreadcrumbsSize() === 'small';
		const resolvedElemBefore = elemBefore ?? iconBefore;
		const [copied, setCopied] = useState(false);
		const [linkElement, setLinkElement] = useState<HTMLAnchorElement | null>(null);
		const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
		const setLinkRef = useCallback((element: HTMLAnchorElement | null) => {
			setLinkElement(element);
		}, []);
		const [, shouldShowTooltip] = useOverflowable(
			truncationWidth,
			linkElement,
			fg('platform_dst_breadcrumbs-refresh') ? 0 : resolvedElemBefore ? ICON_WIDTH_ESTIMATE : 0,
		);

		const handleCopy = useCallback(() => {
			if (!navigator.clipboard) {
				return;
			}

			const url = new URL(href, window.location.href).href;

			navigator.clipboard.writeText(url).then(() => {
				setCopied(true);
				onCopyLink?.();

				if (resetTimerRef.current) {
					clearTimeout(resetTimerRef.current);
				}
				resetTimerRef.current = setTimeout(() => {
					setCopied(false);
				}, COPY_RESET_DELAY_MS);
			}, __noop);
		}, [href, onCopyLink]);

		useEffect(
			() => () => {
				if (resetTimerRef.current) {
					clearTimeout(resetTimerRef.current);
				}
			},
			[],
		);

		const iconElement = resolvedElemBefore && (
			<span
				css={[
					styles.iconWrapper,
					unboundedStyles.iconWrapper,
					fg('platform_dst_breadcrumbs-refresh') && styles.iconWrapperExternal,
					isSmall && styles.iconWrapperExternalSmall,
					isSmall && unboundedStyles.iconWrapperSmall,
				]}
				data-testid={testId && `${testId}--icon-before`}
			>
				{resolvedElemBefore}
			</span>
		);

		const textElement = (
			<span
				css={[
					isSmall && styles.textSmall,
					!isSmall && styles.text,
					truncationWidth && styles.textWithTruncation,
				]}
			>
				{text}
			</span>
		);

		const renderLink = (triggerProps?: TriggerProps) => {
			const { ref: tooltipRef, testId: _testId, ...tooltipTriggerProps } = triggerProps ?? {};

			return (
				<a
					href={href}
					aria-current="page"
					data-testid={testId}
					ref={tooltipRef ? mergeRefs<HTMLAnchorElement>([setLinkRef, tooltipRef]) : setLinkRef}
					css={[
						unboundedStyles.interactiveContainer,
						!fg('platform_dst_breadcrumbs-refresh') && unboundedStyles.interactiveContainerLegacy,
						isSmall && unboundedStyles.interactiveContainerSmall,
						truncationWidth && unboundedStyles.interactiveContainerWithTruncation,
						fg('platform-dst-motion-uplift-list-item') &&
							unboundedStyles.interactiveContainerMotion,
					]}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={
						truncationWidth
							? ({
									'--breadcrumbs-current-item-max-width': `${truncationWidth}px`,
								} as CSSProperties)
							: undefined
					}
					{...tooltipTriggerProps}
				>
					{!fg('platform_dst_breadcrumbs-refresh') && iconElement}
					{textElement}
				</a>
			);
		};

		const copyButton = (
			<Tooltip content={copied ? 'Copied!' : 'Copy link'} position="bottom">
				{(tooltipProps) => (
					<span
						css={unboundedStyles.copyButtonWrapper}
						data-breadcrumbs-copy-link
						data-copied={copied || undefined}
					>
						<IconButton
							{...tooltipProps}
							appearance="subtle"
							icon={LinkIcon}
							isTooltipDisabled
							label={copied ? 'Link copied' : 'Copy link'}
							onClick={handleCopy}
							spacing="compact"
							testId={testId && `${testId}--copy-link`}
						/>
					</span>
				)}
			</Tooltip>
		);

		return (
			<li css={unboundedStyles.itemWrapper} ref={_overflowRef} data-breadcrumbs-current-item>
				<span css={unboundedStyles.container}>
					{fg('platform_dst_breadcrumbs-refresh') && iconElement}
					{shouldShowTooltip ? (
						<Tooltip content={text} position="bottom" onShow={onTooltipShown}>
							{renderLink}
						</Tooltip>
					) : (
						renderLink()
					)}
					{copyButton}
				</span>
			</li>
		);
	},
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default BreadcrumbsCurrentItem;
