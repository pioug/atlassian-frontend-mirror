/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { TOOLBARS } from '@atlaskit/editor-common/toolbar';
import type { PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ToolbarPlugin } from '@atlaskit/editor-plugins/toolbar';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { token } from '@atlaskit/tokens';

import { isToolbar } from '../../../utils/toolbar';
import { ToolbarNext } from '../../Toolbar/Toolbar';
import { useToolbarPortal } from '../../Toolbar/ToolbarPortal';

type FullPageToolbarNextProps = {
	beforeIcon?: React.ReactNode;
	editorAPI?: PublicPluginAPI<[ToolbarPlugin]>;
	toolbarDockingPosition?: 'top' | 'none';
	editorView?: EditorView;
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
	},
});

const MainToolbarWrapper = ({
	children,
	testId,
}: {
	children: React.ReactNode;
	testId?: string;
}) => {
	return (
		<div css={styles.mainToolbarWrapper} data-testid={testId}>
			{children}
		</div>
	);
};

/**
 * TODO: ED-28732 - This component is a work in progress, re-writing `FullPageToolbar` and is not yet complete.
 *
 * [ ] Add support for custom toolbar + splitting into two lines
 *
 * [ ] Add support for toolbar keyboard shortcuts
 *
 * [ ] Add support for toolbar analytics
 *
 * [ ] Add support for toolbar accessibility
 *
 * [ ] Add support for toolbar localization
 */
export const FullPageToolbarNext = ({
	editorAPI,
	beforeIcon,
	toolbarDockingPosition,
	editorView,
}: FullPageToolbarNextProps) => {
	const components = editorAPI?.toolbar?.actions.getComponents();
	const toolbar = components?.find((component) => component.key === TOOLBARS.PRIMARY_TOOLBAR);

	// When a toolbar portal context is provided, render the  toolbar inside a portal.
	// Otherwise fall back to a fragment just to avoid forking rendering logic.
	const { Portal: ToolbarPortal } = useToolbarPortal() ?? { Portal: React.Fragment };

	return (
		<ToolbarPortal>
			<MainToolbarWrapper testId="full-page-primary-toolbar">
				{/* non-custom toolbar */}
				{beforeIcon && <div css={styles.mainToolbarIconBefore}>{beforeIcon}</div>}
				{toolbarDockingPosition !== 'none' && components && isToolbar(toolbar) && (
					<ToolbarNext
						toolbar={toolbar}
						components={components}
						editorView={editorView}
						editorAPI={editorAPI}
					/>
				)}
				{/* --end-- */}
				{/* custom toolbar */}
				{/* --end-- */}
			</MainToolbarWrapper>
		</ToolbarPortal>
	);
};
