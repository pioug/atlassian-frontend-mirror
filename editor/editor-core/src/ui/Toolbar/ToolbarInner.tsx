/** @jsx jsx */
import React from 'react';

import { css, jsx } from '@emotion/react';

import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';

import type EditorActions from '../../actions';

import type { ToolbarInnerProps } from './toolbar-types';

const toolbarComponentsWrapper = css({
	display: 'flex',
	[`@media (max-width: ${akEditorMobileMaxWidth}px)`]: {
		justifyContent: 'space-between',
	},
});

export class ToolbarInner extends React.Component<ToolbarInnerProps> {
	shouldComponentUpdate(nextProps: ToolbarInnerProps) {
		return (
			nextProps.toolbarSize !== this.props.toolbarSize ||
			nextProps.disabled !== this.props.disabled ||
			nextProps.popupsMountPoint === this.props.popupsMountPoint ||
			nextProps.popupsBoundariesElement === this.props.popupsBoundariesElement ||
			nextProps.popupsScrollableElement === this.props.popupsScrollableElement ||
			nextProps.isReducedSpacing !== this.props.isToolbarReducedSpacing
		);
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

		return (
			<div css={toolbarComponentsWrapper}>
				{items.map((component, key) => {
					const props: any = { key };
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
					return element && React.cloneElement(element, props);
				})}
			</div>
		);
	}
}
