/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useContext } from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import {
	MediaPlacement,
	SmartLinkSize,
	type SmartLinkStatus,
	SmartLinkTheme,
} from '../../../../constants';
import { FlexibleUiContext, useFlexibleUiContext } from '../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import {
	isFlexibleUiBlock,
	isFlexibleUiPreviewBlock,
	isFlexibleUiTitleBlock,
	isStyleCacheProvider,
} from '../../../../utils/flexible';
import { type RetryOptions } from '../../types';
import { TitleBlock } from '../blocks';
import { type TitleBlockProps } from '../blocks/title-block/types';

import HoverCardControl from './hover-card-control';
import LayeredLink from './layered-link';
import { type ChildrenOptions, type ContainerProps } from './types';

export const getChildrenOptions = (
	children: React.ReactNode,
	context?: FlexibleUiDataContext,
): ChildrenOptions => {
	let options: ChildrenOptions = {};
	if (isFlexUiPreviewPresent(context)) {
		React.Children.map(children, (child) => {
			if (React.isValidElement(child)) {
				if (isFlexibleUiPreviewBlock(child)) {
					const { placement } = child.props;
					if (placement === MediaPlacement.Left) {
						options.previewOnLeft = true;
					}
					if (placement === MediaPlacement.Right) {
						options.previewOnRight = true;
					}
				}
			}
		});
	}
	return options;
};

const renderChildren = (
	children: React.ReactNode,
	containerSize: SmartLinkSize,
	containerTheme: SmartLinkTheme,
	status?: SmartLinkStatus,
	retry?: RetryOptions,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
	removeBlockRestriction?: boolean,
): React.ReactNode => {
	return React.Children.map(children, (child) => {
		if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
			if (isFlexibleUiTitleBlock(child)) {
				if (isStyleCacheProvider(child)) {
					return updateChildrenTitleBlock(child, {
						onClick,
						retry,
						containerSize,
						status,
						theme: containerTheme,
					});
				} else {
					const { size: blockSize } = child.props;
					const size = blockSize || containerSize;
					return React.cloneElement(child, {
						// @ts-expect-error
						onClick,
						size,
						status,
						theme: containerTheme,
						...(fg('platform-linking-flexible-card-unresolved-action') ? undefined : { retry }),
					});
				}
			}
			const { size: blockSize } = child.props;
			const size = blockSize || containerSize;
			if (isStyleCacheProvider(child)) {
				return updateChildrenBlock(child, size, status);
			}

			// @ts-expect-error
			return React.cloneElement(child, { size, status });
		}

		if (fg('platform-linking-flexible-card-openness')) {
			if (removeBlockRestriction) {
				return child;
			}
		}
	});
};

const updateChildrenBlock = (
	node: React.ReactElement,
	size: SmartLinkSize,
	status: SmartLinkStatus | undefined,
) => {
	const updatedChildren = React.Children.map(node.props.children, (child) => {
		if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
			// @ts-expect-error
			return React.cloneElement(child, { size, status }) as React.ReactElement;
		}
		return child;
	});
	return React.cloneElement(node, { children: updatedChildren });
};

const updateChildrenTitleBlock = (
	node: React.ReactElement,
	{ containerSize, ...props }: Record<string, unknown>,
) => {
	const updatedChildren = React.Children.map(node.props.children, (child) => {
		if (React.isValidElement(child) && isFlexibleUiTitleBlock(child)) {
			const { size: blockSize } = child.props as TitleBlockProps;
			const size = blockSize || containerSize;
			return React.cloneElement(child, {
				...props,
				size,
			} as TitleBlockProps);
		} else {
			return child;
		}
	});
	return React.cloneElement(node, { children: updatedChildren });
};

/**
 * Note: This function is only necessary for CompiledCSS within Jest tests due to the way it handles Styles.
 * CompiledCSS will inject a StyleCacheProvider around the component tree, which
 * causes the children to be wrapped in a StyleCacheProvider as well. This function recursively
 * searches for the first valid TitleBlock within the children of the StyleCacheProvider.
 */
export const getFlexibleUiBlock = (node: React.ReactNode): React.ReactNode | undefined => {
	if (!React.isValidElement(node)) {
		return undefined;
	}

	if (node.type === TitleBlock) {
		return node;
	}

	if (isStyleCacheProvider(node)) {
		// Component wrapped with compiled at runtime, check for children
		let isChildrenValid: React.ReactNode | undefined;
		React.Children.map(node.props.children, (child) => {
			if (typeof child.type !== 'string' && child.type?.name !== 'Style') {
				isChildrenValid = getFlexibleUiBlock(child);
			}
		});
		return isChildrenValid;
	}
	return undefined;
};

const getTitleBlockProps = (children: React.ReactNode): TitleBlockProps | undefined => {
	const block = React.Children.toArray(children)
		.map((child) => getFlexibleUiBlock(child))
		.filter((x) => x !== undefined)
		.at(0);
	if (React.isValidElement(block)) {
		return block.props;
	}
};

const getLayeredLink = (
	testId: string,
	context?: FlexibleUiDataContext,
	children?: React.ReactNode,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): React.ReactNode => {
	const { title, url = '' } = context || {};
	const { anchorTarget: target, text } = getTitleBlockProps(children) || {};
	return (
		<LayeredLink onClick={onClick} target={target} testId={testId} text={text || title} url={url} />
	);
};

const baseStyleCommon = css({
	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	overflowX: 'hidden',
	position: 'relative',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'&:hover ~ .actions-button-group': {
		opacity: 1,
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'a:focus, .has-action:focus': {
		outlineOffset: token('space.negative.025', '-2px'),
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const backgroundStyleOld = css({
	backgroundColor: token('elevation.surface.raised', '#FFFFFF'),
});

const backgroundStyles = css({
	backgroundColor: token('elevation.surface.raised'),
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const elevationStylesOld = css({
	border: `1px solid ${token('color.border', N40)}`,
	borderRadius: token('border.radius.200', '8px'),
	marginTop: token('space.025', '2px'),
	marginRight: token('space.025', '2px'),
	marginBottom: token('space.025', '2px'),
	marginLeft: token('space.025', '2px'),
});

const elevationStyles = css({
	border: `1px solid ${token('color.border')}`,
	borderRadius: token('border.radius.300'),
	marginTop: token('space.025'),
	marginRight: token('space.025'),
	marginBottom: token('space.025'),
	marginLeft: token('space.025'),
});

const clickableContainerStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'a, button, .has-action': {
		position: 'relative',
		zIndex: 1,
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const gapStyleMapOld = cssMap({
	xlarge: {
		gap: '1.25rem 0',
	},
	large: {
		gap: '1rem 0',
	},
	medium: {
		gap: '.5rem 0',
	},
	small: {
		gap: '.25rem 0',
	},
});

const gapStyleMap = cssMap({
	xlarge: {
		gap: `${token('space.250')} 0`,
	},
	large: {
		gap: `${token('space.200')} 0`,
	},
	medium: {
		gap: `${token('space.100')} 0`,
	},
	small: {
		gap: `${token('space.050')} 0`,
	},
});

/**
 * Get container padding based on smart link size
 * Equivalent version for DS primitives space token is getPrimitivesPaddingSpaceBySize()
 * at view/FlexibleCard/components/utils.tsx
 */
const getPadding = (size?: SmartLinkSize): string => {
	if (fg('platform-linking-visual-refresh-v1')) {
		switch (size) {
			case SmartLinkSize.XLarge:
				return token('space.300');
			case SmartLinkSize.Large:
				return token('space.250');
			case SmartLinkSize.Medium:
				return token('space.200');
			case SmartLinkSize.Small:
			default:
				return token('space.100');
		}
	}

	switch (size) {
		case SmartLinkSize.XLarge:
			return '1.5rem';
		case SmartLinkSize.Large:
			return '1.25rem';
		case SmartLinkSize.Medium:
			return '1rem';
		case SmartLinkSize.Small:
		default:
			return '.5rem';
	}
};

const getGap = (size?: SmartLinkSize): string => {
	if (fg('platform-linking-visual-refresh-v1')) {
		switch (size) {
			case SmartLinkSize.XLarge:
				return token('space.250');
			case SmartLinkSize.Large:
				return token('space.200');
			case SmartLinkSize.Medium:
				return token('space.100');
			case SmartLinkSize.Small:
			default:
				return token('space.050');
		}
	}

	switch (size) {
		case SmartLinkSize.XLarge:
			return '1.25rem';
		case SmartLinkSize.Large:
			return '1rem';
		case SmartLinkSize.Medium:
			return '.5rem';
		case SmartLinkSize.Small:
		default:
			return '.25rem';
	}
};

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const previewOnLeftStyleMapOld = cssMap({
	xlarge: {
		paddingLeft: `calc(var(--preview-block-width) + 1.25rem)`,
		'--container-gap-left': '1.25rem',
	},
	large: {
		paddingLeft: `calc(var(--preview-block-width) + 1rem)`,
		'--container-gap-left': '1rem',
	},
	medium: {
		paddingLeft: `calc(var(--preview-block-width) + .5rem)`,
		'--container-gap-left': '.5rem',
	},
	small: {
		paddingLeft: `calc(var(--preview-block-width) + .25rem)`,
		'--container-gap-left': '.25rem',
	},
});

const previewOnLeftStyleMap = cssMap({
	xlarge: {
		paddingLeft: `calc(var(--preview-block-width) + ${token('space.300')})`,
		'--container-gap-left': token('space.300'),
	},
	large: {
		paddingLeft: `calc(var(--preview-block-width) + ${token('space.250')})`,
		'--container-gap-left': token('space.250'),
	},
	medium: {
		paddingLeft: `calc(var(--preview-block-width) + ${token('space.200')})`,
		'--container-gap-left': token('space.200'),
	},
	small: {
		paddingLeft: `calc(var(--preview-block-width) + ${token('space.100')})`,
		'--container-gap-left': token('space.100'),
	},
});

// TODO: Remove on fg cleanup: platform-linking-visual-refresh-v1
const previewOnRightStyleMapOld = cssMap({
	xlarge: {
		paddingRight: `calc(var(--preview-block-width) + 1.25rem)`,
		'--container-gap-right': '1.25rem',
	},
	large: {
		paddingRight: `calc(var(--preview-block-width) + 1rem)`,
		'--container-gap-right': '1rem',
	},
	medium: {
		paddingRight: `calc(var(--preview-block-width) + .5rem)`,
		'--container-gap-right': '.5rem',
	},
	small: {
		paddingRight: `calc(var(--preview-block-width) + .25rem)`,
		'--container-gap-right': '.25rem',
	},
});

const previewOnRightStyleMap = cssMap({
	xlarge: {
		paddingRight: `calc(var(--preview-block-width) + ${token('space.300')})`,
		'--container-gap-right': token('space.300'),
	},
	large: {
		paddingRight: `calc(var(--preview-block-width) + ${token('space.250')})`,
		'--container-gap-right': token('space.250'),
	},
	medium: {
		paddingRight: `calc(var(--preview-block-width) + ${token('space.200')})`,
		'--container-gap-right': token('space.200'),
	},
	small: {
		paddingRight: `calc(var(--preview-block-width) + ${token('space.100')})`,
		'--container-gap-right': token('space.100'),
	},
});

/**
 * A container is a hidden component that build the Flexible Smart Link.
 * All the Flexible UI components are wrapped inside the container.
 * It inherits the ui props from Card component and applies the custom styling
 * accordingly.
 * @internal
 * @see Block
 */
const Container = ({
	children,
	clickableContainer = false,
	hideBackground = false,
	hideElevation = false,
	hidePadding = false,
	onClick,
	retry,
	showHoverPreview = false,
	hoverPreviewOptions,
	actionOptions,
	removeBlockRestriction = false,
	size = SmartLinkSize.Medium,
	status,
	testId = 'smart-links-container',
	theme = SmartLinkTheme.Link,
}: ContainerProps) => {
	di(HoverCardControl);
	const padding = hidePadding
		? fg('platform-linking-visual-refresh-v1')
			? '0px'
			: '0rem'
		: getPadding(size);
	const gap = getGap(size);

	const context = fg('platform-linking-flexible-card-context')
		? // eslint-disable-next-line react-hooks/rules-of-hooks
			useFlexibleUiContext()
		: // eslint-disable-next-line react-hooks/rules-of-hooks
			useContext(FlexibleUiContext);
	const { previewOnLeft, previewOnRight } = getChildrenOptions(children, context);
	const canShowHoverPreview = showHoverPreview && status === 'resolved';
	// `retry` object contains action that can be performed on
	// unresolved link (unauthorized, forbidden, not found, etc.)
	const canShowAuthTooltip = showHoverPreview && status === 'unauthorized' && retry !== undefined;

	const containerPaddingStyles = css({
		'--container-padding': padding,
		'--container-gap-left': previewOnLeft ? gap : padding,
		'--container-gap-right': previewOnRight ? gap : padding,
		'--preview-block-width': '30%',
		padding: padding,
	});

	const container = fg('platform-linking-visual-refresh-v1') ? (
		<div
			css={[
				baseStyleCommon,
				gapStyleMap[size],
				!hideBackground && backgroundStyles,
				containerPaddingStyles,
				previewOnLeft && previewOnLeftStyleMap[size],
				previewOnRight && previewOnRightStyleMap[size],
				!hideElevation && elevationStyles,
				clickableContainer && clickableContainerStyles,
			]}
			data-smart-link-container
			data-testid={testId}
		>
			{clickableContainer ? getLayeredLink(testId, context, children, onClick) : null}
			{renderChildren(children, size, theme, status, retry, onClick, removeBlockRestriction)}
		</div>
	) : (
		<div
			css={[
				baseStyleCommon,
				gapStyleMapOld[size],
				!hideBackground && backgroundStyleOld,
				containerPaddingStyles,
				previewOnLeft && previewOnLeftStyleMapOld[size],
				previewOnRight && previewOnRightStyleMapOld[size],
				!hideElevation && elevationStylesOld,
				clickableContainer && clickableContainerStyles,
			]}
			data-smart-link-container
			data-testid={testId}
		>
			{clickableContainer ? getLayeredLink(testId, context, children, onClick) : null}
			{renderChildren(children, size, theme, status, retry, onClick, removeBlockRestriction)}
		</div>
	);

	if (context?.url && (canShowHoverPreview || canShowAuthTooltip)) {
		return (
			<HoverCardControl
				isHoverPreview={canShowHoverPreview}
				isAuthTooltip={canShowAuthTooltip}
				actionOptions={actionOptions}
				testId={testId}
				url={context.url}
				hoverPreviewOptions={hoverPreviewOptions}
			>
				{container}
			</HoverCardControl>
		);
	}

	return container;
};

export default Container;
