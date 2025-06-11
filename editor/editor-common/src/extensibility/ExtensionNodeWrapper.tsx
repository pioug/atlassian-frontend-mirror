/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

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

type Props = {
	children: React.ReactNode;
	nodeType: string;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	nodeHeight?: string;
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
	nodeHeight,
}: Props) => {
	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};

	const wrapperClassNames = classnames({
		'inline-extension': nodeType === 'inlineExtension' && showMacroInteractionDesignUpdates,
		relative: showMacroInteractionDesignUpdates,
	});

	const content = (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		<span className={wrapperClassNames} css={styles}>
			{children}
			{nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
		</span>
	);

	if (nodeHeight) {
		const extensionStyles = {
			minHeight: `${nodeHeight}px`,
		};

		return <div style={extensionStyles}>{content}</div>;
	}

	return content;
};
