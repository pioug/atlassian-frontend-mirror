/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { SmartCardProvider } from '@atlaskit/link-provider';

import { HorizontalWrapper, LozengeActionExample } from '../utils/vr-test';
import { FlexibleUiContext } from '../../src/state/flexible-ui-context';
import { getContext } from '../utils/flexible-ui';
import { DueOn, State } from '../../src/view/FlexibleCard/components/elements';
import { LozengeAppearance } from '../../src/view/FlexibleCard/components/elements/lozenge/types';
import '../utils/fetch-mock-invoke';
import VRTestWrapper from '../utils/vr-test-wrapper';

const context = getContext({
  dueOn: '2020-02-04T12:40:12.353+0800',
  state: { text: 'State' },
});
const content = ['Short', 'Very long text, longer than long, long, long'];
const appearances: LozengeAppearance[] = [
  'default',
  'inprogress',
  'moved',
  'new',
  'removed',
  'success',
];
const overrideCss = css({
  fontStyle: 'italic',
});

export default () => (
  <VRTestWrapper>
    <SmartCardProvider>
      <FlexibleUiContext.Provider value={context}>
        <HorizontalWrapper>
          {appearances.map((appearance: LozengeAppearance, idx: number) => (
            <State
              key={idx}
              text={appearance as string}
              appearance={appearance}
              testId="vr-test-lozenge"
            />
          ))}
        </HorizontalWrapper>
        <HorizontalWrapper>
          {content.map((text: string, idx: number) => (
            <State
              key={idx}
              text={text}
              appearance="default"
              testId="vr-test-lozenge"
            />
          ))}
        </HorizontalWrapper>
        <HorizontalWrapper>
          <DueOn />
        </HorizontalWrapper>
        <h5>Override CSS</h5>
        <State appearance="moved" overrideCss={overrideCss} text="override" />
        <h5>Action</h5>
        <div>
          <State
            action={LozengeActionExample}
            text="To Do"
            testId="vr-test-lozenge-action"
          />
        </div>
        <br />
      </FlexibleUiContext.Provider>
    </SmartCardProvider>
  </VRTestWrapper>
);
