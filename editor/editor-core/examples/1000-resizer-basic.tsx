/** @jsx jsx */
import type { SyntheticEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import type { HandleResize, HandleSize } from '@atlaskit/editor-common/resizer';
import { resizerStyles } from '@atlaskit/editor-common/styles';
import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';
import { token } from '@atlaskit/tokens';

const options: OptionsPropType = [
  { name: 'small', value: 'small', label: 'Small handler' },
  { name: 'medium', value: 'medium', label: 'Medium handler' },
  { name: 'large', value: 'large', label: 'Large handler' },
];

const snapping: OptionsPropType = [
  { name: 'no snapping', value: 'false', label: 'No snapping' },
  { name: 'snapping', value: 'true', label: 'snapGap is 10 @ [100, 200, 300]' },
];

function Parent(props: {
  text: string;
  handleSize: HandleSize | undefined;
  handleSnap: boolean | undefined;
}): JSX.Element {
  const [width, setWidth] = useState(80);

  const handleResizeStart = () => {};

  const handleResize: HandleResize = (stateOriginal, delta) => {};

  const handleResizeStop: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width;
    setWidth(newWidth);
  };

  const snap = useMemo(() => {
    if (props.handleSnap) {
      return { x: [100, 200, 300] };
    }
  }, [props.handleSnap]);

  return (
    <ResizerNext
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      enable={{ left: true, right: true }}
      handleResizeStart={handleResizeStart}
      handleResize={handleResize}
      handleResizeStop={handleResizeStop}
      handleSize={props.handleSize}
      width={width}
      minWidth={20} // we are adding 10px in the handleResizeStop, so the actual min width will be 20+10 = 30px.
      maxWidth={700} // max width will be 700
      snap={snap}
      snapGap={10}
      isHandleVisible={true}
    >
      <div
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          height: '200px',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          alignItems: 'center',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          justifyContent: 'center',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          backgroundColor: '#efefef',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          color: '#333',
        }}
      >
        {props.text}
      </div>
    </ResizerNext>
  );
}

export default function Example() {
  const [size, setSize] = useState<HandleSize>('medium');
  const [snap, setSnap] = useState(false);

  const onChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    setSize(event.currentTarget.value as HandleSize);
  }, []);

  const onChangeSnap = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      setSnap(event.currentTarget.value === 'false' ? false : true);
    },
    [],
  );

  return (
    <div
      style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        flexDirection: 'column',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        gap: token('space.800', '64px'),
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        alignItems: 'center',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
        height: '500px',
      }}
      css={resizerStyles}
    >
      <div
        style={{
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          display: 'flex',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          flexDirection: 'row',
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
          gap: token('space.800', '64px'),
        }}
      >
        <RadioGroup
          isDisabled={false}
          options={options}
          defaultValue={'medium'}
          onChange={onChange}
          aria-labelledby="radiogroup-label"
        />
        <RadioGroup
          isDisabled={false}
          options={snapping}
          defaultValue={'false'}
          onChange={onChangeSnap}
          aria-labelledby="radiogroup-label"
        />
      </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
      <div style={{ display: 'block' }}>
        <Parent text={size} handleSize={size} handleSnap={snap} />
      </div>
    </div>
  );
}
