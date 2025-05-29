/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import { fg } from '@atlaskit/platform-feature-flags';

import type { ExtensionViewportSize } from '../types';
import { ZERO_WIDTH_SPACE } from '../whitespace';

import type { MacroInteractionDesignFeatureFlags } from './types';

const styles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.inline-extension': {
		display: 'inline-block',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'&.relative': {
		position: 'relative',
	},
});

const viewportSizes = ['small', 'medium', 'default', 'large', 'xlarge'] as const;
type ViewportSizeType = (typeof viewportSizes)[number];
type ViewportSizeObjectType = {
	[size in ViewportSizeType]: string;
};

const macroHeights: ViewportSizeObjectType = {
	small: '112px',
	medium: '262px',
	default: '262px',
	large: '524px',
	xlarge: '1048px',
};

const getViewportHeight = (
	extensionId?: string,
	extensionViewportSizes?: ExtensionViewportSize[],
): string | undefined => {
	const viewportSize =
		Array.isArray(extensionViewportSizes) && extensionId
			? extensionViewportSizes.find((ext) => ext.extensionId === extensionId)?.viewportSize
			: undefined;

	if (!viewportSize) {
		return undefined;
	}

	// If it's a predefined size, use the macroHeights mapping
	if (viewportSizes.includes(viewportSize as ViewportSizeType)) {
		return macroHeights[viewportSize as ViewportSizeType];
	}

	// This is added to somewhat prepare to support connect macros which don't have a predefined size
	// If it's a custom pixel value, use it directly
	if (viewportSize.endsWith('px')) {
		return viewportSize;
	}

	return undefined;
};

type Props = {
	children: React.ReactNode;
	nodeType: string;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	extensionId?: string;
	extensionViewportSizes?: ExtensionViewportSize[];
};

/**
 * If inlineExtension, add zero width space to the end of the nodes and wrap with span;
 * Also if showMacroInteractionDesignUpdates is true, then add the inline-block style to account for the lozenge.
 * else wrap with a div (for multi bodied extensions)
 *
 * @param param0
 * @returns
 */
export const ExtensionNodeWrapper = ({
	children,
	nodeType,
	macroInteractionDesignFeatureFlags,
	extensionId,
	extensionViewportSizes,
}: Props) => {
	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};

	const wrapperClassNames = classnames({
		'inline-extension': nodeType === 'inlineExtension' && showMacroInteractionDesignUpdates,
		relative: showMacroInteractionDesignUpdates,
	});

	const viewportHeight = getViewportHeight(extensionId, extensionViewportSizes);

	const content = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
		<span className={wrapperClassNames} css={styles}>
			{children}
			{nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
		</span>
	);

	if (viewportHeight && fg('confluence_preload_forge_viewport_heights_editor')) {
		return <div style={{ minHeight: viewportHeight }}>{content}</div>;
	}

	return content;
};
