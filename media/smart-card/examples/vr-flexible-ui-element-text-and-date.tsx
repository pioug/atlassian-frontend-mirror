/** @jsx jsx */
import { jsx } from '@emotion/core';

import { VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { getContext } from './utils/flexible-ui';
import {
  CreatedBy,
  ModifiedBy,
  CreatedOn,
  ModifiedOn,
  Snippet,
} from '../src/view/FlexibleCard/components/elements';

const context = getContext({
  modifiedOn: '2022-01-12T12:40:12.353+0800',
  createdOn: '2020-02-04T12:40:12.353+0800',
  createdBy: 'Doctor Stephen Vincent Strange',
  modifiedBy: 'Tony Stark',
  snippet:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id feugiat elit, ut gravida felis. Phasellus arcu velit, tincidunt id rhoncus sit amet, vehicula vel ligula. Nullam nec vestibulum velit, eu tempus elit. Nunc sodales ultricies metus eget facilisis. Phasellus a arcu tortor. In porttitor metus ac ex ornare, quis efficitur est laoreet. Fusce elit elit, finibus vulputate accumsan ut, porttitor eu libero. Mauris eget hendrerit risus, vitae mollis dui. Sed pretium nisi tellus, quis bibendum est vestibulum ac.',
});

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Text">
    <FlexibleUiContext.Provider value={context}>
      <CreatedBy testId="vr-test-text" />
      <ModifiedBy />
      <CreatedOn />
      <ModifiedOn />
      <Snippet />
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
