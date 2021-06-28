import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/standard-button';
import {
  ExampleEditor as FullPageEditor,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';
import EditorContext from '../src/ui/EditorContext';
import { DevTools } from '../example-helpers/DevTools';
import WithEditorActions from '../src/ui/WithEditorActions';
import { ContextPanel } from '../src';
import { fromLocation } from '../example-helpers/adf-url';

export const Textarea = styled.textarea`
  box-sizing: border-box;
  border: 1px solid lightgray;
  font-family: monospace;
  padding: 10px;
  width: 100%;
  height: 250px;
`;

export interface State {
  inputValue?: string;
}

const FullPageWithAdfImport: React.FC = function FullPageWithAdfImport() {
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
          defaultValue={adfValue}
          smartLinks={{ allowEmbeds: true, allowBlockCards: true }}
          customPrimaryToolbarComponents={
            <WithEditorActions
              key={1}
              render={(actions) => {
                return (
                  <>
                    <Button
                      isDisabled={!actions}
                      onClick={async () => {
                        const value = await actions.getValue();
                        setAdfValue(value);
                      }}
                      style={{ marginRight: 5 }}
                    >
                      Export ADF
                    </Button>
                  </>
                );
              }}
            />
          }
          allowTables={{
            advanced: true,
            allowColumnSorting: true,
          }}
          contextPanel={
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
          }
        />
        <div style={{ position: 'fixed', top: 90, right: 15 }}>
          <Button
            id="toggle-adf-input"
            onClick={() => setPanelOpen(!panelOpen)}
            style={{ marginRight: 5 }}
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

const AdfPanel: React.FC<AdfPanelProps> = function AdfPanel(props) {
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
