/** @jsx jsx */
import React, { useContext } from 'react';
import { css, jsx, type SerializedStyles } from '@emotion/react';
import { token } from '@atlaskit/tokens';

import {
	MediaPlacement,
	SmartLinkSize,
	type SmartLinkStatus,
	SmartLinkTheme,
} from '../../../../constants';
import { type ChildrenOptions, type ContainerProps } from './types';
import {
	isFlexibleUiBlock,
	isFlexibleUiPreviewBlock,
	isFlexibleUiTitleBlock,
} from '../../../../utils/flexible';
import { type RetryOptions } from '../../types';
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import LayeredLink from './layered-link';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { type TitleBlockProps } from '../blocks/title-block/types';
import HoverCardControl from './hover-card-control';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import { N40 } from '@atlaskit/theme/colors';
import { di } from 'react-magnetic-di';

const elevationStyles: SerializedStyles = css({
	border: `1px solid ${token('color.border', N40)}`,
	borderRadius: token('border.radius.200', '8px'),
	margin: token('space.025', '2px'),
});

const getGap = (size?: SmartLinkSize): string => {
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

/**
 * Get container padding based on smart link size
 * Equivalent version for DS primitives space token is getPrimitivesPaddingSpaceBySize()
 * at view/FlexibleCard/components/utils.tsx
 */
const getPadding = (size?: SmartLinkSize): string => {
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

const clickableContainerStyles = css({
	'a, button, .has-action': {
		position: 'relative',
		zIndex: 1,
	},
});

const getContainerPaddingStyles = (
	size: SmartLinkSize,
	hidePadding: boolean,
	childrenOptions: ChildrenOptions,
) => {
	const padding = hidePadding ? '0rem' : getPadding(size);
	const gap = getGap(size);
	const { previewOnLeft, previewOnRight } = childrenOptions;

	return css(
		{
			'--container-padding': padding,
			'--container-gap-left': previewOnLeft ? gap : padding,
			'--container-gap-right': previewOnRight ? gap : padding,
			'--preview-block-width': '30%',
			padding: padding,
		},
		previewOnLeft ? `padding-left: calc(var(--preview-block-width) + ${gap});` : '',
		previewOnRight ? `padding-right: calc(var(--preview-block-width) + ${gap});` : '',
	);
};

const getChildrenOptions = (
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

export const getContainerStyles = (
	size: SmartLinkSize,
	hideBackground: boolean,
	hideElevation: boolean,
	hidePadding: boolean,
	clickableContainer: boolean,
	childrenOptions: ChildrenOptions,
): SerializedStyles => {
	const paddingCss = getContainerPaddingStyles(size, hidePadding, childrenOptions);

	// eslint-disable-next-line @atlaskit/design-system/no-css-tagged-template-expression -- needs manual remediation
	return css`
		display: flex;
		gap: ${getGap(size)} 0;
		flex-direction: column;
		min-width: 0;
		overflow-x: hidden;
		position: relative;
		${hideBackground ? '' : `background-color: ${token('elevation.surface.raised', '#FFFFFF')};`}
		${paddingCss}
    ${hideElevation ? '' : elevationStyles}
    ${clickableContainer ? clickableContainerStyles : ''}
    &:hover ~ .actions-button-group {
			opacity: 1;
		}
		a:focus,
		.has-action:focus {
			outline-offset: -2px;
		}
	`;
};

const renderChildren = (
	children: React.ReactNode,
	containerSize: SmartLinkSize,
	containerTheme: SmartLinkTheme,
	status?: SmartLinkStatus,
	retry?: RetryOptions,
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>,
): React.ReactNode =>
	React.Children.map(children, (child) => {
		// TODO: EDM-6468: Use useFlexibleUiOptionContext for rendering options inside block/element instead
		if (React.isValidElement(child) && isFlexibleUiBlock(child)) {
			const { size: blockSize } = child.props;
			const size = blockSize || containerSize;
			if (isFlexibleUiTitleBlock(child)) {
				return React.cloneElement(child, {
					// @ts-expect-error
					onClick,
					retry,
					size,
					status,
					theme: containerTheme,
				});
			}
			// @ts-expect-error
			return React.cloneElement(child, { size, status });
		}
	});

const getTitleBlockProps = (children: React.ReactNode): TitleBlockProps | undefined => {
	const block = React.Children.toArray(children).find((child) => isFlexibleUiTitleBlock(child));

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
	hideHoverCardPreviewButton = false,
	hidePadding = false,
	onClick,
	retry,
	showAuthTooltip = false,
	showHoverPreview = false,
	actionOptions,
	size = SmartLinkSize.Medium,
	status,
	testId = 'smart-links-container',
	theme = SmartLinkTheme.Link,
}: ContainerProps) => {
	di(HoverCardControl);

	const context = useContext(FlexibleUiContext);
	const childrenOptions = getChildrenOptions(children, context);
	const canShowHoverPreview = showHoverPreview && status === 'resolved';
	// `retry` object contains action that can be performed on
	// unresolved link (unauthorized, forbidden, not found, etc.)
	const canShowAuthTooltip = showAuthTooltip && status === 'unauthorized' && retry !== undefined;

	const container = (
		<div
			css={getContainerStyles(
				size,
				hideBackground,
				hideElevation,
				hidePadding,
				clickableContainer,
				childrenOptions,
			)}
			data-smart-link-container
			data-testid={testId}
		>
			{clickableContainer ? getLayeredLink(testId, context, children, onClick) : null}
			{renderChildren(children, size, theme, status, retry, onClick)}
		</div>
	);

	if (context?.url && (canShowHoverPreview || canShowAuthTooltip)) {
		return (
			<HoverCardControl
				hideHoverCardPreviewButton={hideHoverCardPreviewButton}
				isHoverPreview={canShowHoverPreview}
				isAuthTooltip={canShowAuthTooltip}
				actionOptions={actionOptions}
				testId={testId}
				url={context.url}
			>
				{container}
			</HoverCardControl>
		);
	}

	return container;
};

export default Container;
