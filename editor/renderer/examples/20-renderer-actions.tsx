import React from 'react';
import { generateUuid } from '@atlaskit/adf-schema';

import RendererDemo from './helper/RendererDemo';
import { RendererActionsContext } from '../src/ui/RendererActionsContext';
import { WithRendererActions } from '../src/ui/RendererActionsContext/WithRendererActions';

export default function Example() {
  return (
    <RendererActionsContext>
      <WithRendererActions
        render={actions => {
          return (
            <>
              <button
                style={{ marginLeft: '100px' }}
                onClick={() => {
                  const selection = window.getSelection();
                  if (!selection || selection.isCollapsed) {
                    return;
                  }

                  actions.annotate(
                    selection.getRangeAt(0),
                    generateUuid(),
                    'inlineComment',
                  );
                }}
              >
                Add annotation
              </button>
              <RendererDemo serializer="react" />
            </>
          );
        }}
      />
    </RendererActionsContext>
  );
}
