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
} from '../src/view/FlexibleCard/components/elements';

const context = getContext({
  modifiedOn: '2022-01-12T12:40:12.353+0800',
  createdOn: '2020-02-04T12:40:12.353+0800',
  createdBy: 'Doctor Stephen Vincent Strange',
  modifiedBy: 'Tony Stark',
});

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Text">
    <FlexibleUiContext.Provider value={context}>
      <CreatedBy testId="vr-test-text" />
      <ModifiedBy />
      <CreatedOn />
      <ModifiedOn />
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
