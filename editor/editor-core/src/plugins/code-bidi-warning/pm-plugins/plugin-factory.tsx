import React from 'react';
import ReactDOM from 'react-dom';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';

import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';

import { pluginFactory } from '../../../utils/plugin-state-factory';
import { stepHasSlice } from '../../../utils/step';

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

      const newBidiWarningsDecorationSet = createBidiWarningsDecorationSetFromDoc(
        {
          doc: tr.doc,
          codeBidiWarningLabel: pluginState.codeBidiWarningLabel,
        },
      );

      return { ...pluginState, decorationSet: newBidiWarningsDecorationSet };
    },
  },
);

export function createBidiWarningsDecorationSetFromDoc({
  doc,
  codeBidiWarningLabel,
}: {
  doc: PmNode<any>;
  codeBidiWarningLabel: string;
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
        renderDOM(bidiCharacter, codeBidiWarningLabel),
      );
    }),
  );

  return newBidiWarningsDecorationSet;
}

function renderDOM(bidiCharacter: string, codeBidiWarningLabel: string) {
  const element = document.createElement('span');

  // Note: we use this pattern elsewhere (see highlighting code block, and drop cursor widget decoration)
  // we should investigate if there is a memory leak with such usage.
  ReactDOM.render(
    <CodeBidiWarning
      bidiCharacter={bidiCharacter}
      skipChildren={true}
      label={codeBidiWarningLabel}
    />,
    element,
  );

  return element;
}
