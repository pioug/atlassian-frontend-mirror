/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type KeyboardEvent as ReactKeyboardEvent,
	type MouseEvent as ReactMouseEvent,
	type ReactNode,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Link from '@atlaskit/link';
import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { N30A, N60A } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
	DEFAULT_I18N_PROPS_SKIP_LINKS,
	PAGE_LAYOUT_CONTAINER_SELECTOR,
} from '../../common/constants';
import { type SkipLinkData, useSkipLinks } from '../../controllers';

import { type SkipLinkWrapperProps } from './types';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const prefersReducedMotionStyles = css(prefersReducedMotion());

const skipLinkStyles = css({
	margin: token('space.250', '10px'),
	padding: '0.8rem 1rem',
	position: 'fixed',
	zIndex: -1,
	background: token('elevation.surface.overlay', 'white'),
	border: 'none',
	borderRadius: token('radius.small', '3px'),
	boxShadow: token(
		'elevation.shadow.overlay',
		`0 0 0 1px ${N30A}, 0 2px 10px ${N30A}, 0 0 20px -4px ${N60A}`,
	),
	insetInlineStart: -999999,
	opacity: 0,
	transform: 'translateY(-50%)',
	transition: `transform 0.3s ${easeOut}`,
	'&:focus-within': {
		zIndex: 2147483640,
		insetInlineStart: 0,
		opacity: 1,
		transform: 'translateY(0%)',
	},
});

const skipLinkHeadingStyles = css({ fontWeight: token('font.weight.semibold') });

const skipLinkListStyles = css({
	listStylePosition: 'outside',
	listStyleType: 'none',
	marginBlockStart: token('space.050', '4px'),
	paddingInlineStart: 0,
});

const skipLinkListItemStyles = css({ marginBlockStart: 0 });

const assignIndex = (num: number, arr: number[]): number => {
	if (!arr.includes(num)) {
		return num;
	}

	return assignIndex(num + 1, arr);
};

/**
 * The default label will be used when the `skipLinksLabel` attribute is not
 * provided or the attribute is an empty string. If a string comprised only of
 * spaces is provided, the skip link heading element will be removed, but the
 * default label will still be used in `title` attribute of the skip links
 * themselves.
 */
export const SkipLinkWrapper = ({ skipLinksLabel }: SkipLinkWrapperProps) => {
	const { skipLinksData } = useSkipLinks();

	if (skipLinksData.length === 0) {
		return null;
	}

	const sortSkipLinks = (arr: SkipLinkData[]) => {
		const customLinks = arr.filter((link: SkipLinkData) => Number.isInteger(link.listIndex));

		if (customLinks.length === 0) {
			return arr;
		}

		const usedIndexes = customLinks.map((a) => a.listIndex) as number[];
		const regularLinksWithIdx = arr
			.filter((link) => link.listIndex === undefined)
			.map((link, idx) => {
				const listIndex = assignIndex(idx, usedIndexes);
				usedIndexes.push(listIndex);

				return {
					...link,
					listIndex,
				};
			});

		return [...customLinks, ...regularLinksWithIdx].sort((a, b) => a.listIndex! - b.listIndex!);
	};

	const escapeHandler = (event: KeyboardEvent) => {
		if (event.keyCode === 27) {
			const container = document.querySelector(
				`[${PAGE_LAYOUT_CONTAINER_SELECTOR}="true"]`,
			) as HTMLElement;
			if (container !== null) {
				container.focus();
			}
		}
	};

	const attachEscHandler = () => window.addEventListener('keydown', escapeHandler, false);

	const removeEscHandler = () => window.removeEventListener('keydown', escapeHandler, false);

	const emptyLabelOverride = !!skipLinksLabel?.match(/^\s+$/);

	const label = skipLinksLabel || DEFAULT_I18N_PROPS_SKIP_LINKS;

	return (
		<div
			onFocus={attachEscHandler}
			onBlur={removeEscHandler}
			css={[skipLinkStyles, prefersReducedMotionStyles]}
			data-skip-link-wrapper
		>
			{/* eslint-disable-next-line @atlaskit/design-system/use-primitives-text */}
			{emptyLabelOverride ? null : <p css={skipLinkHeadingStyles}>{label}</p>}
			<ol css={skipLinkListStyles}>
				{sortSkipLinks(skipLinksData).map(({ id, skipLinkTitle }: SkipLinkData) => (
					<SkipLink key={id} href={`#${id}`} isFocusable>
						{skipLinkTitle}
					</SkipLink>
				))}
			</ol>
		</div>
	);
};

const handleBlur = (event: ReactMouseEvent | ReactKeyboardEvent) => {
	// @ts-ignore
	event.target.removeAttribute('tabindex');
	// @ts-ignore
	event.target.removeEventListener('blur', handleBlur);
};

const focusTargetRef = (href: string) => (event: ReactMouseEvent | ReactKeyboardEvent) => {
	event.preventDefault();
	const targetRef = document.querySelector(href);

	// @ts-ignore
	const key = event.which || event.keycode;
	// if it is a keypress and the key is not
	// space or enter, just ignore it.
	if (key && key !== 13 && key !== 32) {
		return;
	}

	if (targetRef) {
		targetRef.setAttribute('tabindex', '-1');
		// @ts-ignore
		targetRef.addEventListener('blur', handleBlur);
		// @ts-ignore
		targetRef.focus();
		document.activeElement &&
			document.activeElement.scrollIntoView({
				behavior: 'smooth',
			});
		window.scrollTo(0, 0);
	}

	return false;
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const SkipLink = ({
	href,
	children,
	isFocusable,
}: {
	href: string;
	children: ReactNode;
	isFocusable: boolean;
}) => {
	return (
		<li css={skipLinkListItemStyles}>
			<Link tabIndex={isFocusable ? 0 : -1} href={href} onClick={focusTargetRef(href)}>
				{children}
			</Link>
		</li>
	);
};
