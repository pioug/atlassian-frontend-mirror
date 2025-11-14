/* eslint-disable @atlaskit/design-system/consistent-css-prop-usage */
/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, cssMap, jsx } from '@compiled/react';
import { di } from 'react-magnetic-di';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { MediaPlacement, SmartLinkSize } from '../../../../constants';
import { useFlexibleUiContext } from '../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import {
	isFlexibleUiBlock,
	isFlexibleUiPreviewBlock,
	isStyleCacheProvider,
} from '../../../../utils/flexible';
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

const filterChildren = (children: React.ReactNode, removeBlockRestriction?: boolean) => {
	if (removeBlockRestriction) {
		return children;
	}

	return React.Children.map(children, (child) =>
		React.isValidElement(child) && isFlexibleUiBlock(child) ? child : undefined,
	);
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
	const { linkTitle, url = '' } = context || {};
	const { anchorTarget: target, text } = getTitleBlockProps(children) || {};
	return (
		<LayeredLink
			onClick={onClick}
			target={target}
			testId={testId}
			text={text || linkTitle?.text}
			url={url}
		/>
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

const backgroundStyles = css({
	backgroundColor: token('elevation.surface.raised'),
});

const elevationStyles = css({
	border: `${token('border.width')} solid ${token('color.border')}`,
	borderRadius: token('radius.xlarge'),
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
};

const getGap = (size?: SmartLinkSize): string => {
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
};

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
}: ContainerProps) => {
	di(HoverCardControl);

	const padding = hidePadding ? '0px' : getPadding(size);
	const gap = getGap(size);

	const context = useFlexibleUiContext();

	const { previewOnLeft, previewOnRight } = getChildrenOptions(children, context);
	const canShowHoverPreview =
		showHoverPreview &&
		(status === 'resolved' ||
			(hoverPreviewOptions?.render !== undefined && fg('smart-link-custom-hover-card-content')));
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

	const container = (
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
			{filterChildren(children, removeBlockRestriction)}
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
