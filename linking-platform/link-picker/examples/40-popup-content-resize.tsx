import React, { Fragment, useCallback, useRef, useState } from 'react';

import Button from '@atlaskit/button';
import Popup from '@atlaskit/popup';
import Toggle from '@atlaskit/toggle';
import { token } from '@atlaskit/tokens';

import { PageHeader, PageWrapper } from '../example-helpers/common';
import { LinkPicker, LinkPickerState } from '../src';
import { MockLinkPickerPromisePlugin } from '../src/__tests__/__helpers/mock-plugins';

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

function TestContentResize() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = useCallback(() => setIsOpen(prev => !prev), []);
  const [isUpdateOn, setIsUpdateOn] = useState(false);
  const plugins = useRef([new Plugin()]);

  const linkPickerPopup = (
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
          // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
          style={{ position: 'fixed', bottom: 350 }}
        >
          Toggle
        </Button>
      )}
    />
  );

  return (
    <Fragment>
      <PageHeader>
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
      </PageHeader>
      <div style={{ marginTop: token('space.250', '20px') }}>
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
      {linkPickerPopup}
    </Fragment>
  );
}

export default function TestContentResizeWrapper() {
  return (
    <PageWrapper>
      <TestContentResize />
    </PageWrapper>
  );
}
