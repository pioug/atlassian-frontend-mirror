import React from 'react';
import SectionMessage from '../src';

const Example = () => (
  <SectionMessage
    title="The Modern Prometheus"
    actions={[
      {
        key: 'mary',
        href: 'https://en.wikipedia.org/wiki/Mary_Shelley',
        text: 'Mary',
      },
      {
        key: 'villa',
        href: 'https://en.wikipedia.org/wiki/Villa_Diodati',
        text: 'Villa Diodatti',
      },
    ]}
  >
    <p>
      You will rejoice to hear that no disaster has accompanied the commencement
      of an enterprise which you have regarded with such evil forebodings. I
      arrived here yesterday, and my first task is to assure my dear sister of
      my welfare and increasing confidence in the success of my undertaking.
    </p>
  </SectionMessage>
);

export default Example;
