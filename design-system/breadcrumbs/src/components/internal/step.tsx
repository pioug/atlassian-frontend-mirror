/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, Fragment } from 'react';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next/usePlatformLeafEventHandler';
import { cssMap, cx, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { fg } from '@atlaskit/platform-feature-flags';
import { Anchor, Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import type { BreadcrumbsItemProps } from '../../types';

type StepProps = {
	children?: BreadcrumbsItemProps['text'];
	analyticsContext?: BreadcrumbsItemProps['analyticsContext'];
	href?: BreadcrumbsItemProps['href'];
	target?: BreadcrumbsItemProps['target'];
	iconBefore?: BreadcrumbsItemProps['iconBefore'];
	iconAfter?: BreadcrumbsItemProps['iconBefore'];
	onClick?: BreadcrumbsItemProps['onClick'];
	testId?: BreadcrumbsItemProps['testId'];
	truncationWidth?: BreadcrumbsItemProps['truncationWidth'];
};

const analyticsAttributes = {
	componentName: 'breadcrumbsItem',
	packageName: process.env._PACKAGE_NAME_ as string,
	packageVersion: process.env._PACKAGE_VERSION_ as string,
};

const noop = __noop;

const styles = cssMap({
	root: {
		font: token('font.body'),
		paddingBlock: token('space.025'),
		paddingInline: token('space.0'),
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtlest'),
		border: 'none',
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050'),
		borderRadius: token('radius.small'),
		textDecoration: 'none',

		'&:hover': {
			textDecoration: 'underline',
			color: token('color.text.subtlest'),
		},
		'&:focus': {
			textDecoration: 'none',
			color: token('color.text.subtlest'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text'),
		},
	},
	rootT26Shape: {
		borderRadius: token('radius.xsmall'),
	},
	withoutTruncation: {
		minWidth: '0px',
		flexShrink: '1',
	},
	text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	},
});

/**
 * __Step__
 *
 * A button that represents a single step in a breadcrumbs component.
 */
const Step: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<StepProps> & React.RefAttributes<HTMLSpanElement>
> = forwardRef<HTMLSpanElement, StepProps>(
	(
		{
			analyticsContext,
			href,
			iconAfter,
			iconBefore,
			onClick: onClickProvided = noop,
			target,
			testId,
			children,
			truncationWidth,
		},
		ref,
	) => {
		const handleClick = usePlatformLeafEventHandler({
			fn: onClickProvided,
			action: 'clicked',
			analyticsData: analyticsContext,
			...analyticsAttributes,
		});

		const content = (
			<Fragment>
				{iconBefore}
				<span css={styles.text} ref={ref}>
					{children}
				</span>
				{iconAfter}
			</Fragment>
		);

		if (href) {
			return (
				<Anchor
					href={href}
					onClick={handleClick}
					target={target}
					testId={testId}
					xcss={cx(
						styles.root,
						!truncationWidth && styles.withoutTruncation,
						fg('platform-dst-shape-theme-default') && styles.rootT26Shape,
					)}
					style={{
						maxWidth: truncationWidth,
					}}
				>
					{content}
				</Anchor>
			);
		}

		return (
			<Pressable
				onClick={handleClick}
				testId={testId}
				xcss={cx(
					styles.root,
					!truncationWidth && styles.withoutTruncation,
					fg('platform-dst-shape-theme-default') && styles.rootT26Shape,
				)}
				style={{
					maxWidth: truncationWidth,
				}}
			>
				{content}
			</Pressable>
		);
	},
);

export default Step;
