import React, { Fragment, useMemo } from 'react';

import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';
import { token } from '@atlaskit/tokens';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

const link = {
  url: '',
  displayText: null,
  title: null,
  meta: {
    inputMethod: 'manual',
  },
};

export default function VrWithPluginAction() {
  const plugins = useMemo(
    () => [
      new MockLinkPickerPromisePlugin({
        action: {
          label: {
            id: 'test',
            defaultMessage: 'Action',
            description: 'test action',
          },
          callback: () => {},
        },
      }),
    ],
    [],
  );

  return (
    <PageWrapper>
      <Fragment>
        <div style={{ paddingBottom: token('space.250', '20px') }}>
          <a id="test-link" href={link.url} target="_blank">
            {link.displayText || link.url}
          </a>
        </div>
        <LinkPicker
          plugins={plugins}
          url={link.url}
          displayText={link.displayText}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      </Fragment>
    </PageWrapper>
  );
}
