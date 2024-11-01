/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import isEqual from 'lodash/isEqual';

import { isSSR } from '@atlaskit/editor-common/core-utils';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';

import type EditorActions from '../../actions';

import type { ToolbarInnerProps } from './toolbar-types';

const toolbarComponentsWrapper = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		justifyContent: 'space-between',
	},
});

export class ToolbarInner extends React.Component<ToolbarInnerProps> {
	shouldComponentUpdate(nextProps: ToolbarInnerProps) {
		return !isEqual(nextProps, this.props);
	}

	render() {
		const {
			appearance,
			editorView,
			editorActions,
			eventDispatcher,
			providerFactory,
			items,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
			toolbarSize,
			disabled,
			isToolbarReducedSpacing,
			dispatchAnalyticsEvent,
			containerElement,
		} = this.props;

		if (!items || !items.length) {
			return null;
		}
		if (isSSR()) {
			// Toolbar in SSR environment is showing collapsed state, which caused layout shift after hydrating to SPA.
			// Hiding toolbar in SSR until the dependency of screen width is resolved in SSR environment.
			return null;
		}

		return (
			<div css={toolbarComponentsWrapper} data-vc="toolbar-inner">
				{items.map((component, key) => {
					const element = component({
						editorView,
						editorActions: editorActions as EditorActions,
						eventDispatcher,
						providerFactory,
						appearance: appearance!,
						popupsMountPoint,
						popupsBoundariesElement,
						popupsScrollableElement,
						disabled,
						toolbarSize,
						isToolbarReducedSpacing,
						containerElement,
						isLastItem: key === items.length - 1,
						dispatchAnalyticsEvent,
						wrapperElement: null,
					});
					return element && React.cloneElement(element, { key });
				})}
			</div>
		);
	}
}
