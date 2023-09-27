/** @jsx jsx */
import type { SyntheticEvent } from 'react';
import { useCallback, useState, useMemo } from 'react';
import { jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import type { HandleSize, HandleResize } from '@atlaskit/editor-common/resizer';

import { RadioGroup } from '@atlaskit/radio';
import type { OptionsPropType } from '@atlaskit/radio/types';

import { resizerStyles } from '@atlaskit/editor-common/styles';

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
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#efefef',
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
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        alignItems: 'center',
        height: '500px',
      }}
      css={resizerStyles}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '60px' }}>
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
      <div style={{ display: 'block' }}>
        <Parent text={size} handleSize={size} handleSnap={snap} />
      </div>
    </div>
  );
}
