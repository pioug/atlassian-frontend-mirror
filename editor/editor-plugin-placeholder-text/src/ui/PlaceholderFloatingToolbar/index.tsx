import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { placeholderTextMessages as messages } from '@atlaskit/editor-common/messages';
import { PanelTextInput } from '@atlaskit/editor-common/ui';

import type { Coordinates } from '../FloatingToolbar';
import FloatingToolbar from '../FloatingToolbar';
import {
	getNearestNonTextNode,
	getOffsetParent,
	handlePositionCalculatedWith,
} from '../FloatingToolbar/utils';

export interface Props {
	children?: React.ReactNode;
	editorViewDOM: HTMLElement;
	getFixedCoordinatesFromPos: (pos: number) => Coordinates;
	getNodeFromPos: (pos: number) => Node;
	hidePlaceholderFloatingToolbar: () => void;

	insertPlaceholder: (value: string) => void;
	popupsBoundariesElement?: HTMLElement;
	popupsMountPoint?: HTMLElement;
	setFocusInEditor: () => void;
	showInsertPanelAt: number;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class PlaceholderFloatingToolbar extends React.Component<Props & WrappedComponentProps> {
	handleSubmit = (value?: string) => {
		if (value) {
			this.props.insertPlaceholder(value);
			this.props.setFocusInEditor();
		} else {
			this.props.hidePlaceholderFloatingToolbar();
		}
	};

	handleBlur = () => {
		this.props.hidePlaceholderFloatingToolbar();
	};

	render() {
		const {
			getNodeFromPos,
			showInsertPanelAt,
			editorViewDOM,
			popupsMountPoint,
			getFixedCoordinatesFromPos,
			popupsBoundariesElement,
			intl: { formatMessage },
		} = this.props;
		const target = getNodeFromPos(showInsertPanelAt);
		const offsetParent = getOffsetParent(editorViewDOM, popupsMountPoint);
		const getFixedCoordinates = () => getFixedCoordinatesFromPos(showInsertPanelAt);
		const handlePositionCalculated = handlePositionCalculatedWith(
			offsetParent,
			target,
			getFixedCoordinates,
		);
		return (
			<FloatingToolbar
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				target={getNearestNonTextNode(target)!}
				onPositionCalculated={handlePositionCalculated}
				popupsMountPoint={popupsMountPoint}
				popupsBoundariesElement={popupsBoundariesElement}
				fitHeight={32}
				offset={[0, 12]}
			>
				<PanelTextInput
					placeholder={formatMessage(messages.placeholderTextPlaceholder)}
					onSubmit={this.handleSubmit}
					onBlur={this.handleBlur}
					autoFocus
					width={300}
				/>
			</FloatingToolbar>
		);
	}
}

export default injectIntl(PlaceholderFloatingToolbar);
