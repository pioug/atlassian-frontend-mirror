import React from 'react';
import { EditorAppearanceComponentProps } from '../../types';
import { MobileAppearance } from '../AppearanceComponents/Mobile';
import WidthEmitter from '../WidthEmitter';

export default function Mobile({
  editorView,
  maxHeight,
  persistScrollGutter,
  editorDOMElement,
}: EditorAppearanceComponentProps) {
  return (
    <MobileAppearance
      editorView={editorView || null}
      maxHeight={maxHeight}
      persistScrollGutter={persistScrollGutter}
    >
      {editorDOMElement}
      {editorView && <WidthEmitter editorView={editorView} />}
    </MobileAppearance>
  );
}
