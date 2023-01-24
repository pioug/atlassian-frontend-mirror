/** @jsx jsx */
import { jsx } from '@emotion/react';

import { ExpandedFrame } from '../src/view/EmbedCard/components/ExpandedFrame';
import { VRTestWrapper } from './utils/vr-test';

export default () => (
  <VRTestWrapper title="Embed card frame">
    <ExpandedFrame
      text={'frame text'}
      href={'https://www.google.com'}
      testId={'href-defined'}
    >
      <div>Expanded Frame with href</div>
    </ExpandedFrame>
    <ExpandedFrame text={'frame text'} testId={'no-props'}>
      <div>Expanded Frame with no props</div>
    </ExpandedFrame>
    <ExpandedFrame
      text={'frame text'}
      isPlaceholder={true}
      onClick={() => {}}
      testId={'isplaceholder-true-and-onclick-defined'}
    >
      <div>Expanded Frame with isPlacholder=true and onclick</div>
    </ExpandedFrame>
    <ExpandedFrame
      text={'frame text'}
      isPlaceholder={true}
      href={'https://www.google.com'}
      testId={'isplaceholder-true-and-href-defined'}
    >
      <div>Expanded Frame with isPlaceholder=true and href</div>
    </ExpandedFrame>
    <ExpandedFrame
      text={'frame text'}
      isPlaceholder={false}
      href={'https://www.google.com'}
      testId={'isplaceholder-false-and-href-defined'}
    >
      <div>Expanded Frame with isPlaceholder=false and href</div>
    </ExpandedFrame>
    <ExpandedFrame
      text={'frame text'}
      isPlaceholder={false}
      onClick={() => {}}
      testId={'isplaceholder-false-and-onclick-defined'}
    >
      <div>Expanded Frame with isPlaceholder=false and onclick</div>
    </ExpandedFrame>
  </VRTestWrapper>
);
