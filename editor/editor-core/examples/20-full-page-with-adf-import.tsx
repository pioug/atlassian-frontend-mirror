/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/standard-button';
import { token } from '@atlaskit/tokens';

import { fromLocation } from '../example-helpers/adf-url';
import { DevTools } from '../example-helpers/DevTools';
import { ContextPanel } from '../src';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';

import {
  ExampleEditor as FullPageEditor,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';

export const textareaStyle = css({
  boxSizing: 'border-box',
  border: '1px solid lightgray',
  fontFamily: 'monospace',
  padding: token('space.150', '12px'),
  width: '100%',
  height: '250px',
});

export interface State {
  inputValue?: string;
}

const FullPageWithAdfImport = function FullPageWithAdfImport() {
  const maybeDoc = fromLocation<object>(window.parent.location);
  const doc = maybeDoc instanceof window.Error ? undefined : maybeDoc;

  const document =
    doc ||
    (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
    undefined;

  const [adfValue, setAdfValue] = React.useState(document);
  const [panelOpen, setPanelOpen] = React.useState(true);

  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <FullPageEditor
          editorProps={{
            defaultValue: adfValue,
            smartLinks: { allowEmbeds: true, allowBlockCards: true },
            allowTables: {
              advanced: true,
              allowColumnSorting: true,
            },
            contextPanel: (
              <WithEditorActions
                key={1}
                render={(actions) => (
                  <AdfPanel
                    open={panelOpen}
                    value={adfValue}
                    onInput={(value) => {
                      setAdfValue(value);
                      try {
                        // Don't try to set document if no valid json
                        const data = JSON.parse(value);
                        actions.replaceDocument(data);
                      } catch (err) {}
                    }}
                  />
                )}
              />
            ),
          }}
          customPrimaryToolbarComponents={
            <WithEditorActions
              key={1}
              render={(actions) => {
                return (
                  <Fragment>
                    <Button
                      isDisabled={!actions}
                      onClick={async () => {
                        const value = await actions.getValue();
                        setAdfValue(value);
                      }}
                      style={{ marginRight: token('space.050', '4px') }}
                    >
                      Export ADF
                    </Button>
                  </Fragment>
                );
              }}
            />
          }
        />
        <div
          style={{
            position: 'fixed',
            top: token('space.1000', '80px'),
            right: token('space.200', '16px'),
          }}
        >
          <Button
            id="toggle-adf-input"
            onClick={() => setPanelOpen(!panelOpen)}
            style={{ marginRight: token('space.050', '4px') }}
          >
            {panelOpen ? 'Close' : 'Open'} Panel
          </Button>
        </div>
      </div>
    </EditorContext>
  );
};

export default FullPageWithAdfImport;

export interface AdfPanelProps {
  open: boolean;
  value: string | object | undefined;
  onInput(value: string): void;
}

const AdfPanel = function AdfPanel(props: AdfPanelProps) {
  const value =
    typeof props.value === 'string'
      ? props.value
      : JSON.stringify(props.value || {}, null, 2);

  const ref = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (ref.current && ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  });

  return (
    <ContextPanel visible={props.open}>
      <div
        id="adf-input"
        contentEditable
        ref={ref}
        onInput={(e) => {
          const el = e.target instanceof HTMLElement ? e.target : undefined;
          el && props.onInput(el.textContent!);
        }}
        style={{
          width: '100%',
          minHeight: '100%',
          border: 0,
          fontFamily: 'monospace',
          whiteSpace: 'pre',
        }}
      />
    </ContextPanel>
  );
};
