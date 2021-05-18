import React from 'react';

import SectionMessage, { SectionMessageAction } from '../src';

export default () => {
  return (
    <SectionMessage
      title="The Modern Prometheus"
      actions={[
        <SectionMessageAction href="https://en.wikipedia.org/wiki/Mary_Shelley">
          Mary
        </SectionMessageAction>,
        <SectionMessageAction href="https://en.wikipedia.org/wiki/Villa_Diodati">
          Villa Diodatti
        </SectionMessageAction>,
      ]}
    >
      <p>
        You will rejoice to hear that no disaster has accompanied the
        commencement of an enterprise which you have regarded with such evil
        forebodings. I arrived here yesterday, and my first task is to assure my
        dear sister of my welfare and increasing confidence in the success of my
        undertaking.
      </p>
    </SectionMessage>
  );
};
