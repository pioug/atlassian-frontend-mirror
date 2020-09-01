import React from 'react';
import { EditorAppearanceComponentProps } from '../../types';
import { MobileAppearance } from '../AppearanceComponents/Mobile';
import WidthEmitter from '../WidthEmitter';

export default function Mobile({
  editorView,
  maxHeight,
  editorDOMElement,
}: EditorAppearanceComponentProps) {
  return (
    <MobileAppearance editorView={editorView || null} maxHeight={maxHeight}>
      {editorDOMElement}
      {editorView && <WidthEmitter editorView={editorView} />}
    </MobileAppearance>
  );
}
