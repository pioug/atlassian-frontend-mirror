import React, { useState } from 'react';
import { generateUuid } from '@atlaskit/adf-schema';

import RendererDemo from './helper/RendererDemo';
import { document as storyDataDocument } from './helper/story-data';
import { RendererActionsContext } from '../src/ui/RendererActionsContext';
import { WithRendererActions } from '../src/ui/RendererActionsContext/WithRendererActions';

export default function Example() {
  const [document, setDocument] = useState(storyDataDocument);
  return (
    <RendererActionsContext>
      <WithRendererActions
        render={actions => {
          return (
            <RendererDemo
              serializer="react"
              document={document}
              actionButtons={[
                <button
                  onClick={() => {
                    const selection = window.getSelection();
                    if (!selection || selection.isCollapsed) {
                      return;
                    }

                    const result = actions.annotate(
                      selection.getRangeAt(0),
                      generateUuid(),
                      'inlineComment',
                    );

                    if (result) {
                      selection.removeAllRanges();
                      // @ts-ignore
                      setDocument(result.doc);
                    }
                  }}
                >
                  Add annotation
                </button>,
              ]}
            />
          );
        }}
      />
    </RendererActionsContext>
  );
}
