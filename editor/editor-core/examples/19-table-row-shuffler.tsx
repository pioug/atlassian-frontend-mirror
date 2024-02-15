import React, { useCallback, useRef, useState } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { TableMap } from '@atlaskit/editor-tables';
import {
  findTable,
  // moveColumn,
  moveRow,
} from '@atlaskit/editor-tables/utils';
import { useExampleDocument } from '@atlaskit/editor-test-helpers/use-example-document';
// import Button, { ButtonGroup } from '@atlaskit/button';
import Toggle from '@atlaskit/toggle';

import { useCountDown } from '../example-helpers/hooks/useCountDown';

import { default as FullPageExample } from './5-full-page';

export default function Example() {
  const defaultValue = useExampleDocument('./adf/table.json');

  const editorView = useRef<EditorView>();

  const [shuffleRowsEnabled, setShuffleRowsEnabled] = useState(false);
  const [shuffleRows, setShuffleRows] = useState(false);

  const doTheShuffle = useCallback(() => {
    setShuffleRows(false);

    if (editorView.current) {
      const { state, dispatch } = editorView.current;

      const table = findTable(state.selection);
      if (table) {
        const map = TableMap.get(table.node);
        if (map.height > 1) {
          console.log('SHUFFLE TIME!!!!');
          dispatch(moveRow(state, 0, map.height - 1)(state.tr));
        } else {
          console.log(
            'Shuffle rows only works on tables with more then 1 row.',
          );
        }
      } else {
        console.log('Shuffle only works on selected tables');
      }
    }
  }, []);

  const { start, stop } = useCountDown(5000, doTheShuffle);

  const toggleShuffleRows = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShuffleRows((prev) => {
        stop();

        if (!prev) {
          start();
        }
        return !prev;
      });
    },
    [start, stop],
  );

  return (
    <FullPageExample
      editorProps={{
        defaultValue,
        allowTables: {
          allowColumnResizing: true,
          allowMergeCells: true,
          allowNumberColumn: true,
          allowBackgroundColor: true,
          allowHeaderRow: true,
          allowHeaderColumn: true,
          permittedLayouts: 'all',
        },
      }}
      customPrimaryToolbarComponents={
        <>
          <label htmlFor="toggle-row-shuffle">Shuffle Rows (5 secs)</label>
          <Toggle
            id="toggle-row-shuffle"
            size="large"
            isDisabled={!shuffleRowsEnabled}
            isChecked={shuffleRows}
            onChange={toggleShuffleRows}
          />
        </>
      }
      onExampleEditorReady={(actions) => {
        console.log('ready', actions);
        editorView.current = actions._privateGetEditorView();
        setShuffleRowsEnabled(true);
      }}
    />
  );
}
