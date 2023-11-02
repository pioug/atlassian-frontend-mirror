import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { defineMessages, injectIntl } from 'react-intl-next';

import { PanelTextInput } from '@atlaskit/editor-common/ui';

import type { Coordinates } from '../FloatingToolbar';
import FloatingToolbar, {
  getNearestNonTextNode,
  getOffsetParent,
  handlePositionCalculatedWith,
} from '../FloatingToolbar';

export const messages = defineMessages({
  placeholderTextPlaceholder: {
    id: 'fabric.editor.placeholderTextPlaceholder',
    defaultMessage: 'Add placeholder text',
    description: '',
  },
});

export interface Props {
  getNodeFromPos: (pos: number) => Node;
  getFixedCoordinatesFromPos: (pos: number) => Coordinates;
  insertPlaceholder: (value: string) => void;
  hidePlaceholderFloatingToolbar: () => void;
  setFocusInEditor: () => void;

  showInsertPanelAt: number;
  editorViewDOM: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
class PlaceholderFloatingToolbar extends React.Component<
  Props & WrappedComponentProps
> {
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
    const getFixedCoordinates = () =>
      getFixedCoordinatesFromPos(showInsertPanelAt);
    const handlePositionCalculated = handlePositionCalculatedWith(
      offsetParent,
      target,
      getFixedCoordinates,
    );
    return (
      <FloatingToolbar
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
