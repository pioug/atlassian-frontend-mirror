/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback } from 'react';

import { useIntl } from 'react-intl-next';

import { cssMap, jsx } from '@atlaskit/css';
import { ContextPanelConsumer } from '@atlaskit/editor-common/context-panel';
import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEqualsNoExposure } from '@atlaskit/tmp-editor-statsig/exp-val-equals-no-exposure';
import { token } from '@atlaskit/tokens';

import { isToolbar } from '../../../utils/toolbar';
import { ToolbarNext } from '../../Toolbar/Toolbar';
import { useToolbarPortal } from '../../Toolbar/ToolbarPortal';

type FullPageToolbarNextProps = {
	beforeIcon?: React.ReactNode;
	editorAPI?: PublicPluginAPI<[ToolbarPlugin]>;
	toolbarDockingPosition?: 'top' | 'none';
	editorView?: EditorView;
	popupsMountPoint?: HTMLElement;
	showKeyline: boolean;
};

const styles = cssMap({
	// copied from mainToolbarIconBeforeStyle
	mainToolbarIconBefore: {
		marginTop: token('space.200', '16px'),
		marginRight: token('space.200', '16px'),
		marginBottom: token('space.200', '16px'),
	},
	mainToolbarWrapper: {
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
	},
	mainToolbarWithKeyline: {
		boxShadow: token('elevation.shadow.overflow'),
	},
});

const MainToolbarWrapper = ({
	children,
	testId,
	showKeyline,
}: {
	children: React.ReactNode;
	testId?: string;
	showKeyline: boolean;
}) => {
	return (
		<div
			css={[styles.mainToolbarWrapper, showKeyline && styles.mainToolbarWithKeyline]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};

export const FullPageToolbarNext = ({
	editorAPI,
	beforeIcon,
	toolbarDockingPosition,
	editorView,
	popupsMountPoint,
	showKeyline,
}: FullPageToolbarNextProps) => {
	const components = editorAPI?.toolbar?.actions.getComponents();
	const intl = useIntl();
	const toolbar = components?.find((component) => component.key === TOOLBARS.PRIMARY_TOOLBAR);

	// When a toolbar portal context is provided, render the  toolbar inside a portal.
	// Otherwise fall back to a fragment just to avoid forking rendering logic.
	const { Portal: ToolbarPortal } = useToolbarPortal() ?? { Portal: React.Fragment };
	const hasToolbarPortal = ToolbarPortal !== React.Fragment;
	const mountPoint = hasToolbarPortal ? undefined : popupsMountPoint;

	const isShortcutToFocusToolbarRaw = (event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && event.key === 'F9';
	};
	const isShortcutToFocusToolbarMemoized = useCallback(isShortcutToFocusToolbarRaw, []);
	const isShortcutToFocusToolbar = expValEqualsNoExposure(
		'platform_editor_toolbar_rerender_optimization_exp',
		'isEnabled',
		true,
	)
		? isShortcutToFocusToolbarMemoized
		: isShortcutToFocusToolbarRaw;

	const handleEscapeRaw = (event: KeyboardEvent) => {
		if (!editorView?.hasFocus()) {
			editorView?.focus();
		}
		event.preventDefault();
		event.stopPropagation();
	};

	const handleEscapeMemoized = useCallback(
		(event: KeyboardEvent) => {
			if (!editorView?.hasFocus()) {
				editorView?.focus();
			}
			event.preventDefault();
			event.stopPropagation();
		},
		[editorView],
	);

	const handleEscape = expValEqualsNoExposure(
		'platform_editor_toolbar_rerender_optimization_exp',
		'isEnabled',
		true,
	)
		? handleEscapeMemoized
		: handleEscapeRaw;

	return (
		<ContextPanelConsumer>
			{({ width: ContextPanelWidth }) => (
				<ToolbarArrowKeyNavigationProvider
					editorView={editorView}
					childComponentSelector="[data-testid='ak-editor-main-toolbar']"
					isShortcutToFocusToolbar={isShortcutToFocusToolbar}
					handleEscape={handleEscape}
					intl={intl}
				>
					<ToolbarPortal>
						<MainToolbarWrapper
							testId="ak-editor-main-toolbar"
							showKeyline={showKeyline || ContextPanelWidth > 0}
						>
							{beforeIcon && <div css={styles.mainToolbarIconBefore}>{beforeIcon}</div>}
							{toolbarDockingPosition !== 'none' && components && isToolbar(toolbar) && (
								<ToolbarNext
									toolbar={toolbar}
									components={components}
									editorView={editorView}
									editorAPI={editorAPI}
									popupsMountPoint={mountPoint}
									editorAppearance="full-page"
								/>
							)}
						</MainToolbarWrapper>
					</ToolbarPortal>
				</ToolbarArrowKeyNavigationProvider>
			)}
		</ContextPanelConsumer>
	);
};
