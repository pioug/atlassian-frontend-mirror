/**
 * @jsxRuntime classic
 * @jsx jsx
 * @jsxFrag
 */
import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { cssMap, jsx } from '@atlaskit/css';
import { ContextPanelConsumer } from '@atlaskit/editor-common/context-panel';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import {
	shouldShowPrimaryToolbar,
	TOOLBARS,
	VIEW_MODE_TOGGLE_SECTION,
} from '@atlaskit/editor-common/toolbar';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import { ToolbarArrowKeyNavigationProvider } from '@atlaskit/editor-common/ui-menu';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { RegisterComponent } from '@atlaskit/editor-toolbar-model';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { PrimaryToolbarComponents } from '../../../types/editor-props';
import type { MarkdownModePlugin, MarkdownModeView } from '../../../types/markdown-mode';
import { isToolbar } from '../../../utils/toolbar';
import ExcludeFromHydration from '../../ExcludeFromHydration';
import { ToolbarNext } from '../../Toolbar/Toolbar';
import { ToolbarPortalMountPoint, useToolbarPortal } from '../../Toolbar/ToolbarPortal';

type FullPageToolbarNextProps = {
	beforeIcon?: React.ReactNode;
	customPrimaryToolbarComponents?: PrimaryToolbarComponents;
	disabled: boolean;
	disabledWithoutInteractionLogic?: boolean;
	editorAPI?: FullPageToolbarPluginAPI;
	editorView?: EditorView;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	popupsScrollableElement?: HTMLElement;
	showKeyline: boolean;
	toolbarDockingPosition?: 'top' | 'none';
};

type FullPageToolbarPluginAPI = PublicPluginAPI<
	[ToolbarPlugin, OptionalPlugin<MarkdownModePlugin>]
>;

const styles = cssMap({
	// copied from mainToolbarIconBeforeStyle
	mainToolbarIconBefore: {
		marginTop: token('space.200'),
		marginRight: token('space.200'),
		marginBottom: token('space.200'),
	},
	mainToolbarIconBeforeNew: {
		alignItems: 'center',
		display: 'flex',
	},
	mainToolbarWrapper: {
		borderBottom: `${token('border.width')} solid ${token('color.border')}`,
		paddingBlock: token('space.075'),
		paddingInline: token('space.150'),
	},
	mainToolbarNew: {
		display: 'flex',
		height: '32px',
	},
	mainToolbarZIndex: {
		// same value akEditorFloatingDialogZIndex and is accepted
		zIndex: 510,
		position: 'relative',
	},
	mainToolbarWithKeyline: {
		boxShadow: token('elevation.shadow.overflow'),
	},
	customToolbarWrapperStyle: {
		alignItems: 'center',
		display: 'flex',
	},
	firstChildWrapperOneLine: {
		display: 'flex',
		flexGrow: 1,
	},
	firstChildWrapperContainerContext: {
		// @ts-expect-error - containerType is not typed
		containerType: 'inline-size',
		// @ts-expect-error - containerName is not typed
		containerName: 'toolbar-container',
	},
	secondChildWrapperOneLine: {
		display: 'flex',
		minWidth: 'fit-content',
		alignItems: 'center',
	},
	beforePrimaryToolbarComponents: {
		display: 'flex',
		flexGrow: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	backgroundColor: {
		backgroundColor: token('elevation.surface'),
	},
});

const MainToolbarWrapper = ({
	children,
	testId,
	showKeyline,
}: {
	children: React.ReactNode;
	showKeyline: boolean;
	testId?: string;
}) => {
	return (
		<div
			css={[
				styles.mainToolbarWrapper,
				showKeyline && styles.mainToolbarWithKeyline,
				styles.mainToolbarZIndex,
				styles.mainToolbarNew,
				expValEquals(
					'platform_editor_table_sticky_header_improvements',
					'cohort',
					'test_with_overflow',
				) &&
					expValEquals('platform_editor_table_sticky_header_patch_9', 'isEnabled', true) &&
					styles.backgroundColor,
			]}
			data-testid={testId}
		>
			{children}
		</div>
	);
};

const FirstChildWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div
			css={[styles.firstChildWrapperOneLine, styles.firstChildWrapperContainerContext]}
			data-testid="main-toolbar-first-child-wrapper"
		>
			{children}
		</div>
	);
};

const SecondChildWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<div css={styles.secondChildWrapperOneLine} data-testid="main-toolbar-second-child-wrapper">
			{children}
		</div>
	);
};

const shouldShowToolbarContainer = (
	toolbar?: RegisterComponent,
	customPrimaryToolbarComponents?: PrimaryToolbarComponents,
) => {
	return !!toolbar || !!customPrimaryToolbarComponents;
};

const getToolbarComponentsForMarkdownView = (
	components: RegisterComponent[],
	markdownModeView?: MarkdownModeView,
) => {
	if (
		(markdownModeView === 'syntax' || markdownModeView === 'preview') &&
		fg('platform_editor_markdown_mode_hide_source_toolbar')
	) {
		return components.filter(
			(component) =>
				component.key === TOOLBARS.PRIMARY_TOOLBAR ||
				component.key === VIEW_MODE_TOGGLE_SECTION.key,
		);
	}

	return components;
};

export const FullPageToolbarNext = ({
	editorAPI,
	beforeIcon,
	toolbarDockingPosition,
	editorView,
	popupsMountPoint,
	showKeyline,
	customPrimaryToolbarComponents,
	disabled,
	disabledWithoutInteractionLogic,
}: FullPageToolbarNextProps): JSX.Element => {
	const components = editorAPI?.toolbar?.actions.getComponents();
	const runtimeOverride = useSharedPluginStateWithSelector(
		editorAPI,
		['toolbar'],
		(states) => states.toolbarState?.contextualFormattingModeOverride,
	);
	const effectiveRuntimeOverride =
		runtimeOverride !== undefined && fg('platform_editor_toolbar_mode_override')
			? runtimeOverride
			: undefined;
	const contextualFormattingEnabled =
		effectiveRuntimeOverride ?? editorAPI?.toolbar?.actions.contextualFormattingMode();
	const markdownModeView = useSharedPluginStateWithSelector(
		editorAPI,
		['markdownMode'],
		(states) => states.markdownModeState?.view,
	);
	const intl = useIntl();
	const toolbar = components?.find((component) => component.key === TOOLBARS.PRIMARY_TOOLBAR);
	const visibleToolbarComponents = useMemo(
		() =>
			components ? getToolbarComponentsForMarkdownView(components, markdownModeView) : undefined,
		[components, markdownModeView],
	);
	const primaryToolbarDockingConfigEnabled = shouldShowPrimaryToolbar(
		contextualFormattingEnabled,
		toolbarDockingPosition,
	);

	// When a toolbar portal context is provided, render the  toolbar inside a portal.
	// Otherwise fall back to a fragment just to avoid forking rendering logic.
	const { Portal: ToolbarPortal } = useToolbarPortal() ?? { Portal: React.Fragment };
	const hasToolbarPortal = ToolbarPortal !== React.Fragment;
	const mountPoint = hasToolbarPortal ? undefined : popupsMountPoint;

	const isShortcutToFocusToolbar = useCallback((event: KeyboardEvent) => {
		//Alt + F9 to reach first element in this main toolbar
		return event.altKey && event.key === 'F9';
	}, []);

	const handleEscape = useCallback(
		(event: KeyboardEvent) => {
			if (!editorView?.hasFocus()) {
				editorView?.focus();
			}
			event.preventDefault();
			event.stopPropagation();
		},
		[editorView],
	);

	// Remove entire primary toolbar region if:
	// - primary toolbar isn't registered
	// - no custom primary toolbar components to render
	// note: primary toolbar must render if toolbar docking preference is set to "controlled" to avoid SSR conflicts
	if (!shouldShowToolbarContainer(toolbar, customPrimaryToolbarComponents)) {
		return <ToolbarPortal>{null}</ToolbarPortal>;
	}

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
							{beforeIcon && (
								<div css={[styles.mainToolbarIconBefore, styles.mainToolbarIconBeforeNew]}>
									{beforeIcon}
								</div>
							)}
							<>
								<FirstChildWrapper>
									{expValEquals('platform_editor_default_toolbar_state', 'isEnabled', true) ? (
										primaryToolbarDockingConfigEnabled &&
										components &&
										visibleToolbarComponents &&
										isToolbar(toolbar) && (
											<ToolbarNext
												toolbar={toolbar}
												components={visibleToolbarComponents}
												editorView={editorView}
												editorAPI={editorAPI}
												popupsMountPoint={mountPoint}
												editorAppearance="full-page"
												isDisabled={disabled}
												disabledWithoutInteractionLogic={disabledWithoutInteractionLogic}
											/>
										)
									) : (
										<ExcludeFromHydration>
											{primaryToolbarDockingConfigEnabled &&
												components &&
												visibleToolbarComponents &&
												isToolbar(toolbar) &&
												editorView &&
												!isSSR() && (
													<ToolbarNext
														toolbar={toolbar}
														components={visibleToolbarComponents}
														editorView={editorView}
														editorAPI={editorAPI}
														popupsMountPoint={mountPoint}
														editorAppearance="full-page"
														isDisabled={disabled}
														disabledWithoutInteractionLogic={disabledWithoutInteractionLogic}
													/>
												)}
										</ExcludeFromHydration>
									)}
								</FirstChildWrapper>
								<SecondChildWrapper>
									<div css={styles.customToolbarWrapperStyle}>
										{!!customPrimaryToolbarComponents &&
											'before' in customPrimaryToolbarComponents && (
												<div
													css={[styles.beforePrimaryToolbarComponents]}
													data-testid={'before-primary-toolbar-components-plugin'}
												>
													{customPrimaryToolbarComponents.before}
												</div>
											)}
										{!!customPrimaryToolbarComponents && 'after' in customPrimaryToolbarComponents
											? customPrimaryToolbarComponents.after
											: customPrimaryToolbarComponents}
									</div>
								</SecondChildWrapper>
								<ToolbarPortalMountPoint />
							</>
						</MainToolbarWrapper>
					</ToolbarPortal>
				</ToolbarArrowKeyNavigationProvider>
			)}
		</ContextPanelConsumer>
	);
};
