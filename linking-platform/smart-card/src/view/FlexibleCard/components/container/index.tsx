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
import { FlexibleUiContext } from '../../../../state/flexible-ui-context';
import { type FlexibleUiDataContext } from '../../../../state/flexible-ui-context/types';
import { isFlexUiPreviewPresent } from '../../../../state/flexible-ui-context/utils';
import {
	isFlexibleUiBlock,
	isFlexibleUiPreviewBlock,
	isFlexibleUiTitleBlock,
} from '../../../../utils/flexible';
import { type RetryOptions } from '../../types';
import { type TitleBlockProps } from '../blocks/title-block/types';

import HoverCardControl from './hover-card-control';
import ContainerOld from './indexOld';
import LayeredLink from './layered-link';
import { type ChildrenOptions, type ContainerProps } from './types';

/**
 * Eventually these exports should be removed on FF clean up bandicoots-compiled-migration-smartcard
 */
export { getContainerStyles } from './indexOld';

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
): React.ReactNode =>
	React.Children.map(children, (child) => {
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

const backgroundStyle = css({
	backgroundColor: token('elevation.surface.raised', '#FFFFFF'),
});

const elevationStyles = css({
	border: `1px solid ${token('color.border', N40)}`,
	borderRadius: token('border.radius.200', '8px'),
	marginTop: token('space.025', '2px'),
	marginRight: token('space.025', '2px'),
	marginBottom: token('space.025', '2px'),
	marginLeft: token('space.025', '2px'),
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

const previewOnLeftStyleMap = cssMap({
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

const previewOnRightStyleMap = cssMap({
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

/**
 * A container is a hidden component that build the Flexible Smart Link.
 * All the Flexible UI components are wrapped inside the container.
 * It inherits the ui props from Card component and applies the custom styling
 * accordingly.
 * @internal
 * @see Block
 */
const ContainerNew = ({
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
	size = SmartLinkSize.Medium,
	status,
	testId = 'smart-links-container',
	theme = SmartLinkTheme.Link,
}: ContainerProps) => {
	di(HoverCardControl);
	const padding = hidePadding ? '0rem' : getPadding(size);
	const gap = getGap(size);

	const context = useContext(FlexibleUiContext);
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

	const container = (
		<div
			css={[
				baseStyleCommon,
				gapStyleMap[size],
				!hideBackground && backgroundStyle,
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
			{renderChildren(children, size, theme, status, retry, onClick)}
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

const Container = (props: ContainerProps): JSX.Element => {
	if (fg('bandicoots-compiled-migration-smartcard')) {
		return <ContainerNew {...props} />;
	}
	return <ContainerOld {...props} />;
};

export default Container;
