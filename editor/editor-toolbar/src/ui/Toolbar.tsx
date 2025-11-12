/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors */
/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
import React, { type ReactNode } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import { useToolbarUI } from '../hooks/ui-context';

import type { ResponsiveContainerProps } from './ResponsiveContainer';
import { ResponsiveContainer, ResponsiveWrapper } from './ResponsiveContainer';
import { ToolbarKeyboardNavigationProvider } from './ToolbarKeyboardNavigationProvider';
import { ACTION_SUBJECT, ViewEventEmitter, type ViewEventEmitterProps } from './ViewEventEmitter';

const styles = cssMap({
	toolbarBase: {
		borderRadius: token('radius.medium'),
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
	},
	toolbar: {
		backgroundColor: token('elevation.surface.overlay'),
		height: '36px',
		paddingRight: token('space.050'),
		paddingLeft: token('space.050'),
		boxShadow: token('elevation.shadow.overlay'),
	},
	toolbarResponsive: {
		// Adding extra margin around the toolbar so that it collapses earlier before it hits responsive breakpoints
		marginInline: token('space.200'),
	},
	primaryToolbar: {
		backgroundColor: token('elevation.surface'),
		minHeight: '32px',
	},
	toolbarSeparator: {
		/* separators in the inline toolbar should be the same height as the toolbar */
		// @ts-expect-error - container queries are not typed in cssMap
		'&[data-toolbar-type="inline"]': {
			'[data-toolbar-component="separator"]': {
				height: '36px',
			},
		},
	},
	hiddenSelectors: {
		/**
		 * This is not great - but there is no way to know using React if a specific toolbar component returns null. The current CSS still adds
		 * a gap for those elements when they're not rendered because toolbar component is rendered independently.
		 */
		// @ts-expect-error - container queries are not typed in cssMap
		'[data-toolbar-component="section"]:not(:has([data-toolbar-component="button"]))': {
			display: 'none',
		},
		'[class*="show-above-"]:not(:has([data-toolbar-component="section"] [data-toolbar-component="button"], [data-toolbar-component="button-group"] [data-toolbar-component="button"])), [class*="show-below-"]:not(:has([data-toolbar-component="section"] [data-toolbar-component="button"], [data-toolbar-component="button-group"] [data-toolbar-component="button"]))':
			{
				display: 'none',
			},
	},
	hiddenSelectorsPatch: {
		/* separators should be hidden from the ToolbarSection if there is no subsequent ToolbarSection */
		// @ts-expect-error - container queries are not typed in cssMap
		'[data-toolbar-component="section"]:not(:has(~ [data-toolbar-component="section"])) [data-toolbar-component="separator"]':
			{
				display: 'none',
			},
	},
});

type ToolbarProps = {
	children?: ReactNode;
	/**
	 * aria-label for the toolbar (No localisation needed as it won't be read by screen readers).
	 *
	 * use case: query select the toolbar to position floating toolbar
	 */
	label: string;
	testId?: string;
} & ViewEventEmitterProps;

/**
 * A simple component representing a toolbar with box shadows - used to represent a secondary/floating toolbar
 *
 * @note: Responsiveness support replies on container query with container editor-area and media query
 */
export const Toolbar = ({ children, label, actionSubjectId, testId }: ToolbarProps) => {
	const isResponsiveEnabled = expValEquals(
		'platform_editor_toolbar_aifc_responsive',
		'isEnabled',
		true,
	);

	const toolbar = (
		<Box
			xcss={cx(
				styles.toolbarBase,
				styles.toolbar,
				isResponsiveEnabled && styles.toolbarResponsive,
				isResponsiveEnabled && styles.hiddenSelectors,
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) &&
					styles.toolbarSeparator,
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true) &&
					styles.hiddenSelectorsPatch,
			)}
			role="toolbar"
			aria-label={label}
			testId={testId}
			data-toolbar-type={
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
					? 'inline'
					: undefined
			}
		>
			<ViewEventEmitter actionSubject={ACTION_SUBJECT.TOOLBAR} actionSubjectId={actionSubjectId} />
			{children}
		</Box>
	);

	let wrappedToolbar = toolbar;

	const { keyboardNavigation } = useToolbarUI();
	if (keyboardNavigation) {
		const {
			childComponentSelector,
			dom,
			handleEscape,
			handleFocus,
			isShortcutToFocusToolbar,
			ariaControls,
			ariaLabel,
		} = keyboardNavigation;
		wrappedToolbar = (
			<ToolbarKeyboardNavigationProvider
				childComponentSelector={childComponentSelector}
				dom={dom}
				isShortcutToFocusToolbar={isShortcutToFocusToolbar}
				handleEscape={handleEscape}
				handleFocus={handleFocus}
				ariaControls={ariaControls}
				ariaLabel={ariaLabel}
			>
				{toolbar}
			</ToolbarKeyboardNavigationProvider>
		);
	}

	if (isResponsiveEnabled) {
		return <ResponsiveWrapper>{wrappedToolbar}</ResponsiveWrapper>;
	}

	return wrappedToolbar;
};

type PrimaryToolbarProps = ToolbarProps & ResponsiveContainerProps;

/**
 *  A simple component representing a toolbar without box shadows - used to represent a primary toolbar
 */
export const PrimaryToolbar = ({
	children,
	label,
	breakpointPreset,
	reducedBreakpoints,
}: PrimaryToolbarProps) => {
	if (expValEquals('platform_editor_toolbar_aifc_responsive', 'isEnabled', true)) {
		return (
			<ResponsiveContainer
				breakpointPreset={breakpointPreset}
				reducedBreakpoints={reducedBreakpoints}
			>
				<Box
					xcss={cx(styles.toolbarBase, styles.primaryToolbar, styles.hiddenSelectors)}
					role="toolbar"
					aria-label={label}
					data-toolbar-type={
						expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
							? 'primary'
							: undefined
					}
				>
					{children}
				</Box>
			</ResponsiveContainer>
		);
	}

	return (
		<Box
			xcss={cx(styles.toolbarBase, styles.primaryToolbar)}
			role="toolbar"
			aria-label={label}
			data-toolbar-type={
				expValEquals('platform_editor_toolbar_aifc_patch_6', 'isEnabled', true)
					? 'primary'
					: undefined
			}
		>
			{children}
		</Box>
	);
};
