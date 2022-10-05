import React, { useState, useCallback, useRef } from 'react';
import { IntlProvider } from 'react-intl-next';
import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import Toggle from '@atlaskit/toggle';
import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';
import { ufologger } from '@atlaskit/ufo';

import { LinkPicker, LinkPickerState } from '../src';

/**
 * Plugin that returns a set of results with same length as the query string
 */
class Plugin extends MockLinkPickerPromisePlugin {
  async resolve(state: LinkPickerState) {
    const result = await super.resolve(state);

    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });

    return {
      data: result.data.slice(0, state.query.length),
    };
  }
}

const noop = () => {};

ufologger.enable();

export default function TestContentResize() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const [isUpdateOn, setIsUpdateOn] = useState(false);
  const plugins = useRef([new Plugin()]);

  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <h1>Popup Content Resize Test Example</h1>
        <p>
          In this example the link picker will return as many results as the
          length of your search term (max of 5).
        </p>
        <p>
          Experiment with different numbers of results by searching with
          different search query lengths to see how the content resizing impacts
          the positionings of the popup, with and without provision of the
          update method.
        </p>
        <p>
          The popup trigger is positon fixed in a way that the picker should
          ordinarily be off-screen when a full set of results are loaded.
        </p>
        <div style={{ marginTop: 20 }}>
          <Toggle
            id="provide-updateFn-toggle"
            testId="provide-updateFn-toggle"
            size="large"
            isChecked={isUpdateOn}
            onChange={() => setIsUpdateOn(prev => !prev)}
          />
          <label htmlFor="provide-updateFn-toggle">
            Updates {isUpdateOn ? 'on' : 'off'}
          </label>
        </div>
        <Popup
          isOpen={isOpen}
          autoFocus={false}
          onClose={handleToggle}
          content={({ update }) => (
            <LinkPicker
              plugins={plugins.current}
              onSubmit={handleToggle}
              onCancel={handleToggle}
              onContentResize={isUpdateOn ? update : noop}
            />
          )}
          placement="right-start"
          trigger={({ ref, ...triggerProps }) => (
            <Button
              {...triggerProps}
              testId="trigger"
              ref={ref}
              appearance="primary"
              isSelected={isOpen}
              onClick={handleToggle}
              style={{ position: 'fixed', bottom: 350 }}
            >
              Toggle
            </Button>
          )}
        />
      </IntlProvider>
    </div>
  );
}
