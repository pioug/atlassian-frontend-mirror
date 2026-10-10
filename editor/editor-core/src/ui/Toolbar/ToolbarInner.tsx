import React from 'react';

import isEqual from 'lodash/isEqual';

import { isSSR } from '@atlaskit/editor-common/is-ssr';

import type EditorActions from '../../actions';
import type { ToolbarInnerProps } from './toolbar-types';
import { ToolbarComponentsWrapperCompiled } from './ToolbarComponentsWrapper-compiled';

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export class ToolbarInner extends React.Component<ToolbarInnerProps> {
	shouldComponentUpdate(nextProps: ToolbarInnerProps): boolean {
		return !isEqual(nextProps, this.props);
	}

	render(): React.JSX.Element | null {
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
			<ToolbarComponentsWrapperCompiled data-vc="toolbar-inner">
				{items.map((component, key) => {
					const element = component({
						editorView,
						editorActions: editorActions as EditorActions,
						eventDispatcher,
						providerFactory,
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
					// oxlint-disable-next-line react/no-array-index-key
					return element && React.cloneElement(element, { key });
				})}
			</ToolbarComponentsWrapperCompiled>
		);
	}
}
