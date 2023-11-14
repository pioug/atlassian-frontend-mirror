import React from 'react';
import ReactDOM from 'react-dom';
import { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';
import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';

import { pluginFactory } from '../../../utils/plugin-state-factory';
import { stepHasSlice } from '@atlaskit/editor-common/utils';

import { codeBidiWarningPluginKey } from '../plugin-key';
import reducer from './reducer';

export const { createPluginState, getPluginState } = pluginFactory(
  codeBidiWarningPluginKey,
  reducer,
  {
    onDocChanged: (tr, pluginState) => {
      if (!tr.steps.find(stepHasSlice)) {
        return pluginState;
      }

      const newBidiWarningsDecorationSet =
        createBidiWarningsDecorationSetFromDoc({
          doc: tr.doc,
          codeBidiWarningLabel: pluginState.codeBidiWarningLabel,
          tooltipEnabled: pluginState.tooltipEnabled,
        });

      return { ...pluginState, decorationSet: newBidiWarningsDecorationSet };
    },
  },
);

export function createBidiWarningsDecorationSetFromDoc({
  doc,
  codeBidiWarningLabel,
  tooltipEnabled,
}: {
  doc: PmNode;
  codeBidiWarningLabel: string;
  tooltipEnabled: boolean;
}) {
  const bidiCharactersAndTheirPositions: {
    position: number;
    bidiCharacter: string;
  }[] = [];

  doc.descendants((node, pos) => {
    const isTextWithCodeMark =
      node.type.name === 'text' &&
      node.marks &&
      node.marks.some((mark) => mark.type.name === 'code');

    if (isTextWithCodeMark) {
      codeBidiWarningDecorator(node.textContent, ({ bidiCharacter, index }) => {
        bidiCharactersAndTheirPositions.push({
          position: pos + index!,
          bidiCharacter,
        });
      });

      return false;
    }

    const isCodeBlock = node.type.name === 'codeBlock';

    if (isCodeBlock) {
      codeBidiWarningDecorator(node.textContent, ({ bidiCharacter, index }) => {
        bidiCharactersAndTheirPositions.push({
          position: pos + index! + 1,
          bidiCharacter,
        });
      });
    }
  });

  // Bidi characters are not expected to commonly appear in code snippets, so recreating the decoration set
  // for documents rather than reusing existing decorations seems a reasonable performance/complexity tradeoff.

  if (bidiCharactersAndTheirPositions.length === 0) {
    return DecorationSet.empty;
  }

  const newBidiWarningsDecorationSet = DecorationSet.create(
    doc,
    bidiCharactersAndTheirPositions.map(({ position, bidiCharacter }) => {
      return Decoration.widget(position, () =>
        renderDOM({ bidiCharacter, codeBidiWarningLabel, tooltipEnabled }),
      );
    }),
  );

  return newBidiWarningsDecorationSet;
}

function renderDOM({
  bidiCharacter,
  codeBidiWarningLabel,
  tooltipEnabled,
}: {
  bidiCharacter: string;
  codeBidiWarningLabel: string;
  tooltipEnabled: boolean;
}) {
  const element = document.createElement('span');

  // Note: we use this pattern elsewhere (see highlighting code block, and drop cursor widget decoration)
  // we should investigate if there is a memory leak with such usage.
  ReactDOM.render(
    <CodeBidiWarning
      bidiCharacter={bidiCharacter}
      skipChildren={true}
      label={codeBidiWarningLabel}
      tooltipEnabled={tooltipEnabled}
    />,
    element,
  );

  return element;
}
