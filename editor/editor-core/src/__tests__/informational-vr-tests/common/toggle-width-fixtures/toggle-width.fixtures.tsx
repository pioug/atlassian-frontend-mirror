import React, { useState } from 'react';
import { Editor } from '../../../../index';
import adf from './tall-image-local.json';
// eslint-disable-next-line
import { EditorAppearance } from '@atlaskit/editor-common/src/types';

export function EditorFullWidth() {
  const [appearance, setApperance] = useState('full-page');

  const toggleApperance = async () => {
    setApperance(appearance === 'full-page' ? 'full-width' : 'full-page');
  };

  //adding custom function to window for changing width option of Editor
  (window as any).__changeWidth = toggleApperance;

  return (
    <Editor
      defaultValue={adf}
      appearance={appearance as EditorAppearance}
      media={{
        allowMediaSingle: true,
      }}
    />
  );
}

export function EditorFullPage() {
  const [appearance, setApperance] = useState('full-width');

  const toggleApperance = async () => {
    setApperance(appearance === 'full-page' ? 'full-width' : 'full-page');
  };

  //adding custom function to window for changing width option of Editor
  (window as any).__changeWidth = toggleApperance;

  return (
    <Editor
      defaultValue={adf}
      appearance={appearance as EditorAppearance}
      media={{
        allowMediaSingle: true,
      }}
    />
  );
}
