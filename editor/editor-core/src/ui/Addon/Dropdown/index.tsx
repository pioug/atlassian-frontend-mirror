/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type EditorActions from '../../../actions';
import type { RenderOnClickHandler, AddonActions } from '../../Addon/types';

import { dropdown } from './styles';

export interface Props {
	children?: React.ReactNode;
	onClick: (actionOnClick: EditorActions, renderOnClick: RenderOnClickHandler) => void;
	editorActions: EditorActions;
	togglePopup: () => void;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class DropdownWrapper extends React.Component<Props> {
	render() {
		// adding onClick handler to each DropdownItem component
		const children = React.Children.map(this.props.children, (child) =>
			React.cloneElement(child as React.ReactElement, {
				onClick: this.handleClick,
			}),
		);

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		return <div css={dropdown}>{children}</div>;
	}

	private handleClick = (actions: AddonActions) => {
		const { actionOnClick, renderOnClick } = actions;
		const { editorActions } = this.props;
		if (actionOnClick) {
			actionOnClick(editorActions);
			this.props.togglePopup();
		} else if (renderOnClick) {
			this.props.onClick(editorActions, renderOnClick);
		}
	};
}
