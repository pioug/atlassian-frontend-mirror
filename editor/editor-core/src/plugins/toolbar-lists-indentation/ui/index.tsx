/** @jsx jsx */
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { onItemActivated } from './onItemActivated';

import { ToolbarDropdown } from './ToolbarDropdown';
import { Toolbar } from './Toolbar';

export interface Props {
  editorView: EditorView;
  bulletListActive?: boolean;
  bulletListDisabled?: boolean;
  orderedListActive?: boolean;
  orderedListDisabled?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  showIndentationButtons?: boolean;
}

export default function ToolbarListsIndentation(props: Props) {
  const {
    disabled,
    isSmall,
    isReducedSpacing,
    bulletListActive,
    bulletListDisabled,
    orderedListActive,
    orderedListDisabled,
    showIndentationButtons,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
  } = props;

  if (isSmall) {
    return (
      <ToolbarDropdown
        editorView={props.editorView}
        isReducedSpacing={isReducedSpacing}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        popupsScrollableElement={popupsScrollableElement}
        bulletListActive={bulletListActive}
        bulletListDisabled={bulletListDisabled}
        showIndentationButtons={showIndentationButtons}
        orderedListActive={orderedListActive}
        orderedListDisabled={orderedListDisabled}
        disabled={disabled}
        onItemActivated={onItemActivated}
      />
    );
  }

  return (
    <Toolbar
      editorView={props.editorView}
      isReducedSpacing={isReducedSpacing}
      bulletListActive={bulletListActive}
      bulletListDisabled={bulletListDisabled}
      showIndentationButtons={showIndentationButtons}
      orderedListActive={orderedListActive}
      orderedListDisabled={orderedListDisabled}
      disabled={disabled}
      onItemActivated={onItemActivated}
    />
  );
}
