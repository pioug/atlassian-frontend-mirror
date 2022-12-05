/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { HorizontalWrapper, VRTestWrapper } from './utils/vr-test';
import { FlexibleUiContext } from '../src/state/flexible-ui-context';
import { getContext } from './utils/flexible-ui';
import { DueOn, State } from '../src/view/FlexibleCard/components/elements';
import { LozengeAppearance } from '../src/view/FlexibleCard/components/elements/lozenge/types';

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
const overrideCss = css`
  font-style: italic;
`;

export default () => (
  <VRTestWrapper title="Flexible UI: Element: Lozenge">
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
      <h5>Experiment (DO NOT USE)</h5>
      <div>
        <State text="medium" /> <State text="medium" onClick={() => {}} />
      </div>
      <br />
    </FlexibleUiContext.Provider>
  </VRTestWrapper>
);
