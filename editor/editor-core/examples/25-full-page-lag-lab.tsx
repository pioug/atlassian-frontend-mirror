import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import { format } from 'url';
import { default as FullPageExample } from './5-full-page';
import EditorActions from '../src/actions';

// helper function to read url args
const readUrlParams = () => {
  const params = new URLSearchParams(window.parent.location.search);
  const getParam = (name: string, defaultValue: string): string => {
    return params.get(name) || defaultValue;
  };

  let defaultLatencyMode = getParam('lagMode', LATENCY_MODE_FIXED);
  if (
    defaultLatencyMode !== LATENCY_MODE_FIXED &&
    defaultLatencyMode !== LATENCY_MODE_VARIABLE
  ) {
    defaultLatencyMode = LATENCY_MODE_FIXED;
  }

  return {
    defaultLatencyMode: defaultLatencyMode as LatencyMode,
    defaultFixedLatency: Number.parseInt(getParam('lagInput', '300')),
    defaultRangeLatencyFrom: Number.parseInt(getParam('lagFrom', '10')),
    defaultRangeLatencyTo: Number.parseInt(getParam('lagTo', '300')),
    defaultInitLatency: Number.parseInt(getParam('lagInit', '0')),
    defaultFocusLatency: Number.parseInt(getParam('lagFocus', '0')),
    defaultShowPanel: Boolean(getParam('lagPanel', '')),
  };
};

const getRandomBetween = (from: number, to: number) => {
  if (from > to) {
    [from, to] = [to, from];
  }
  return from + Math.floor(Math.random() * (to - from));
};

/*
 * An example which allows user to get a feel for how much latency
 * affects their tolerance towards the editor.
 */
const LATENCY_MODE_FIXED = 'fixed';
const LATENCY_MODE_VARIABLE = 'variable';
type LatencyMode = 'fixed' | 'variable';

const LATENCY_PRESETS = [
  { value: 0, label: 'None' },
  { value: 10, label: 'Good' },
  { value: 25, label: 'Baseline' },
  { value: 50, label: 'Hmm' },
  { value: 100, label: 'Noticable' },
  { value: 200, label: 'Bad' },
  { value: 500, label: 'Awful' },
  { value: 1000, label: 'Nope' },
  { value: 3000, label: 'Pls No' },
];

const {
  defaultLatencyMode,
  defaultFixedLatency,
  defaultRangeLatencyFrom,
  defaultRangeLatencyTo,
  defaultInitLatency,
  defaultFocusLatency,
  defaultShowPanel,
} = readUrlParams();

// Lock the main thread until we've wasted enough time
const lag = (delay: number) => {
  const startTime = Date.now();

  while (Date.now() < startTime + delay) {
    // noop
  }
};

const ExampleWrapper = styled.div`
  display: flex;
  height: 100%;
`;

const LatencyPanelContainer = styled.div`
  max-width: 250px;
  padding: 1em;

  input[type='number'] {
    width: 230px;
    padding: 5px;
    margin: 5px;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  div.range {
    display: flex;
    align-items: center;
    justify-content: space-between;

    input[type='number'] {
      width: 75px;
    }
  }

  div.preset-buttons {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    > button {
      width: 33%;
      font-size: 0.9em;
    }
  }

  div.action-buttons {
    display: flex;
    flex-direction: column;
  }
`;

const FullPageExampleWrapper = styled.div`
  flex-grow: 1;
`;

interface LatencyPanelProps {
  latencyMode: LatencyMode;
  onLatencyModeChanged: (mode: LatencyMode) => void;
  fixedLatency: number;
  variableLatencyFrom: number;
  variableLatencyTo: number;
  onFixedLatencyChange: (mode: number) => void;
  onVariableLatencyFromChange: (mode: number) => void;
  onVariableLatencyToChange: (mode: number) => void;
  onInitLatencyChange: (mode: number) => void;
  onFocusLatencyChange: (mode: number) => void;
}

const LatencyPanel = (props: LatencyPanelProps) => {
  const [initLatency, setInitLatency] = React.useState(defaultInitLatency);
  const [focusLatency, setFocusLatency] = React.useState(defaultFocusLatency);

  const {
    latencyMode,
    onLatencyModeChanged,
    fixedLatency,
    variableLatencyFrom,
    variableLatencyTo,
    onFixedLatencyChange,
    onVariableLatencyFromChange,
    onVariableLatencyToChange,
    onInitLatencyChange,
    onFocusLatencyChange,
  } = props;

  const updateLatency = (callback: (value: number) => void) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.abs(Number.parseInt(event.target.value || '0'));
      callback(value);
    };
  };

  const onApplyClick = () => {
    onInitLatencyChange(initLatency);
    onFocusLatencyChange(focusLatency);
  };

  const onCopyClick = () => {
    const params = new URLSearchParams(window.parent.location.search);
    const data: any = {
      lagMode: latencyMode,
      lagInput: fixedLatency,
      lagFrom: variableLatencyFrom,
      lagTo: variableLatencyTo,
      lagInit: initLatency,
      lagFocus: focusLatency,
    };
    Object.keys(data).forEach((key) => params.set(key, data[key]));
    params.delete('lagPanel');

    const url = format({
      ...window.parent.location,
      search: params.toString(),
    });
    window.parent.history.pushState(data, window.parent.document.title, url);

    // this relies on autoFocus on #latency-type-fixed to suceed
    navigator.clipboard.writeText(url).catch((error) => {
      alert(`Copy failed! ${error}`);
    });
  };

  return (
    <LatencyPanelContainer>
      <h2>Adjust latency</h2>

      <div>
        <p>
          <input
            // autoFocus is used to prevent "copy link for sharing" from failing
            // due to document in iframe not having focus after running
            // __showPanel() in dev console
            autoFocus
            id="latency-type-fixed"
            type="radio"
            name="latency-type"
            checked={latencyMode === LATENCY_MODE_FIXED}
            onChange={() => {
              onLatencyModeChanged(LATENCY_MODE_FIXED);
            }}
          />{' '}
          <label htmlFor="latency-type-fixed">Fixed latency (ms)</label>
        </p>
        <input
          type="number"
          value={fixedLatency}
          min="0"
          onChange={updateLatency(onFixedLatencyChange)}
        />
      </div>

      <p>Presets:</p>
      <div className="preset-buttons">
        {LATENCY_PRESETS.map(({ value, label }) => (
          <Button onClick={() => onFixedLatencyChange(value)} key={value}>
            {label}
          </Button>
        ))}
      </div>

      <hr />
      <label>
        <input
          type="radio"
          name="latency-type"
          checked={latencyMode === LATENCY_MODE_VARIABLE}
          onChange={() => {
            onLatencyModeChanged(LATENCY_MODE_VARIABLE);
          }}
        />{' '}
        Variable latency (ms)
      </label>
      <br />
      <div className="range">
        <input
          min="0"
          type="number"
          value={variableLatencyFrom}
          onChange={updateLatency(onVariableLatencyFromChange)}
        />
        <label> to </label>
        <input
          min="0"
          type="number"
          value={variableLatencyTo}
          onChange={updateLatency(onVariableLatencyToChange)}
        />
      </div>

      <hr />

      <div>
        <p>
          <label htmlFor="init-latency">Initial render latency (ms)</label>
        </p>
        <input
          id="init-latency"
          min="0"
          type="number"
          value={`${initLatency}`}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            updateLatency(setInitLatency)(event);
          }}
        />
      </div>

      <div>
        <p>
          <label>Focus latency (ms)</label>
        </p>
        <input
          type="number"
          value={focusLatency}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            updateLatency(setFocusLatency)(event);
          }}
        />
      </div>

      <hr />

      <div className="action-buttons">
        <Button onClick={onApplyClick}>Apply</Button>

        <Button appearance="primary" onClick={onCopyClick}>
          Copy link for sharing
        </Button>
      </div>
    </LatencyPanelContainer>
  );
};

export default function Example() {
  const [latencyMode, setLatencyMode] = React.useState(defaultLatencyMode);
  const [fixedLatency, setFixedLatency] = React.useState(defaultFixedLatency);
  const [variableLatencyFrom, setVariableLatencyFrom] = React.useState(
    defaultRangeLatencyFrom,
  );
  const [variableLatencyTo, setVariableLatencyTo] = React.useState(
    defaultRangeLatencyTo,
  );
  const [initLatency, setInitLatency] = React.useState(defaultInitLatency);
  const [focusLatency, setFocusLatency] = React.useState(defaultFocusLatency);
  const [showPanel, setPanelVisibility] = React.useState(defaultShowPanel);

  // make it accessible to devs
  (window as any).__showPanel = () => setPanelVisibility(true);
  const onClosePanel = () => setPanelVisibility(false);

  React.useEffect(() => {
    const keypressHandler = (event: KeyboardEvent) => {
      // ignore keypresses in LatencyPanel
      const { styledComponentId } = LatencyPanelContainer as any;
      if ((event.target as Element).closest(`.${styledComponentId}`)) {
        return;
      }

      // Safari doesn't have requestIdleCallback
      const requestCallback =
        (window as any).requestIdleCallback || window.requestAnimationFrame;
      const lastPressed = Date.now();
      const callbackId = requestCallback(() => {
        // Safari doesn't have cancelIdleCallback
        const cancelCallback =
          (window as any).cancelIdleCallback || window.cancelAnimationFrame;
        cancelCallback(callbackId);

        let latency = fixedLatency || 0;
        if (latencyMode === LATENCY_MODE_VARIABLE) {
          latency = getRandomBetween(variableLatencyFrom, variableLatencyTo);
        }
        const now = Date.now();
        const timeTaken = now - lastPressed;
        const artificialLag = latency - timeTaken;

        if (artificialLag > 0) {
          lag(artificialLag);
        }
        console.log(
          'event took',
          `${timeTaken}ms`,
          'artificial latency',
          `${artificialLag}ms`,
        );
      });
    };

    document.addEventListener('keypress', keypressHandler);

    return () => {
      document.removeEventListener('keypress', keypressHandler);
    };
  });

  const onEditorReady = (_: EditorActions, timeTaken?: number) => {
    // set up focus latency
    document.querySelector('.ProseMirror')?.addEventListener('focus', () => {
      lag(focusLatency);
    });

    // initial render latency
    console.debug(
      'initial render lag',
      `timeTaken ${timeTaken}ms`,
      `delay ${initLatency}ms`,
    );
    lag(initLatency - (timeTaken || 0));
  };

  // When the React key changes, the component is destroyed and recreated.
  const editorKey = `editor-${latencyMode}-${initLatency}-${focusLatency}`;

  return (
    <ExampleWrapper>
      <FullPageExampleWrapper>
        <FullPageExample key={editorKey} onExampleEditorReady={onEditorReady} />
      </FullPageExampleWrapper>

      <Drawer isOpen={showPanel} onClose={onClosePanel}>
        <LatencyPanel
          latencyMode={latencyMode}
          onLatencyModeChanged={setLatencyMode}
          fixedLatency={fixedLatency}
          variableLatencyFrom={variableLatencyFrom}
          variableLatencyTo={variableLatencyTo}
          onFixedLatencyChange={setFixedLatency}
          onVariableLatencyFromChange={setVariableLatencyFrom}
          onVariableLatencyToChange={setVariableLatencyTo}
          onInitLatencyChange={setInitLatency}
          onFocusLatencyChange={setFocusLatency}
        />
      </Drawer>
    </ExampleWrapper>
  );
}
