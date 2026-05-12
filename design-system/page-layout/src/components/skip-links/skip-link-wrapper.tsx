/* eslint-disable @repo/internal/dom-events/no-unsafe-event-listeners */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { ReactNode } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css, jsx } from '@emotion/react';

import { easeOut, prefersReducedMotion } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import {
	DEFAULT_I18N_PROPS_SKIP_LINKS,
	PAGE_LAYOUT_CONTAINER_SELECTOR,
} from '../../common/constants';
import { type SkipLinkData, useSkipLinks } from '../../controllers';

import { SkipLink } from './skip-link';
import type { SkipLinkWrapperProps } from './types';

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
const prefersReducedMotionStyles = css(prefersReducedMotion());
const skipLinkStyles = css({
	margin: token('space.250'),
	padding: '0.8rem 1rem',
	position: 'fixed',
	zIndex: -1,
	backgroundColor: token('elevation.surface.overlay'),
	border: 'none',
	borderRadius: token('radius.small', '3px'),
	boxShadow: token('elevation.shadow.overlay'),
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
	marginBlockStart: token('space.050'),
	paddingInlineStart: 0,
});
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
export const SkipLinkWrapper = ({ skipLinksLabel }: SkipLinkWrapperProps): ReactNode => {
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
				// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage
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
