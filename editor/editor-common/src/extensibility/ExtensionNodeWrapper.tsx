/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag React.Fragment
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';
import type { IntlShape } from 'react-intl';

import { token } from '@atlaskit/tokens';

import { ZERO_WIDTH_SPACE } from '../whitespace';
import { ExtensionSSRReactContextsProvider } from './ExtensionSSRReactContextsProvider';
import { GeneratedContentReveal } from './GeneratedContentReveal';
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

// Mirrored by the reveal span in `GeneratedContentReveal`; keep the two in step.
const hoverStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	':has(.extension-label:hover) .extension-container, :has(.extension-edit-toggle-container:hover) .extension-container':
		{
			boxShadow: `0 0 0 1px ${token('color.border.input')}`,
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	':has(.extension-container:hover) .extension-label, :has(.extension-edit-toggle-container:hover) .extension-label, .extension-label:hover':
		{
			opacity: 1,
			backgroundColor: token('color.background.accent.gray.subtlest'),
			boxShadow: 'none',
			cursor: 'pointer',

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.always-hide-label': {
				opacity: 0,
				cursor: 'auto',
			},

			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
			'&.with-bodied-macro-live-page-styles': {
				backgroundColor: token('color.background.input'),
				boxShadow: `0 0 0 1px ${token('color.border')}`,
			},
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	':has(.extension-label:hover) .extension-icon, :has(.extension-container:hover) .extension-icon, :has(.extension-edit-toggle-container:hover) .extension-icon':
		{
			display: 'inline',
		},

	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	':has(.extension-label:hover) .extension-edit-toggle-container, :has(.extension-container:hover) .extension-edit-toggle-container, .extension-edit-toggle-container:hover':
		{
			opacity: 1,
		},
});

type Props = {
	children: React.ReactNode;
	/**
	 * Renders the node through `GeneratedContentReveal`, which holds it closed while its embed loads
	 * and then animates it in. Set by the node view for native embeds only; see
	 * `allowAIGeneratedContentMotion` on the extension plugin's options.
	 */
	generatedContentMotion?: boolean;
	intl: IntlShape | undefined;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	nodeType: string;
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
	generatedContentMotion = false,
	intl,
}: Props): jsx.JSX.Element => {
	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};

	// Fixed for the node view's lifetime: switching would remount the subtree and reload the embed.
	if (generatedContentMotion) {
		return (
			<GeneratedContentReveal
				intl={intl}
				showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
			>
				{children}
			</GeneratedContentReveal>
		);
	}

	const wrapperClassNames = classnames({
		'inline-extension': nodeType === 'inlineExtension' && showMacroInteractionDesignUpdates,
		relative: showMacroInteractionDesignUpdates,
	});

	return (
		<ExtensionSSRReactContextsProvider intl={intl}>
			<span
				data-testid="extension-node-wrapper"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={wrapperClassNames}
				css={[styles, hoverStyles]}
			>
				{children}
				{nodeType === 'inlineExtension' && ZERO_WIDTH_SPACE}
			</span>
		</ExtensionSSRReactContextsProvider>
	);
};
