import React from 'react';

import SectionMessage, { SectionMessageAction } from '../src';

const SomeParts = ({
  body,
  title,
  actions,
}: {
  body?: boolean;
  title?: boolean;
  actions?: boolean;
}) => (
  <div style={{ padding: '10px' }}>
    <SectionMessage
      title={title ? 'The Modern Prometheus' : undefined}
      actions={
        actions
          ? [
              <SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
                Mary
              </SectionMessageAction>,
              <SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
                Villa Diodatti
              </SectionMessageAction>,
              <SectionMessageAction>M. J. Godwin</SectionMessageAction>,
            ]
          : []
      }
    >
      {body ? (
        <p>
          You will rejoice to hear that no disaster has accompanied the
          commencement of an enterprise which you have regarded with such evil
          forebodings. I arrived here yesterday, and my first task is to assure
          my dear sister of my welfare and increasing confidence in the success
          of my undertaking.
        </p>
      ) : null}
    </SectionMessage>
  </div>
);

const Example = () => (
  <div>
    <p>
      This example has been constructed for ease-of-reference and comparison in
      developing section message. It is not a suggested implementation.
    </p>
    <SomeParts body title actions />
    <SomeParts body title />
    <SomeParts body actions />
    <SomeParts title actions />
    <SomeParts body />
    <SomeParts title />
    <SomeParts actions />
  </div>
);

export default Example;
