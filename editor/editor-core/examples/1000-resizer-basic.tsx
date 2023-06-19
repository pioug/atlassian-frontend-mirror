/** @jsx jsx */
import { useCallback, SyntheticEvent, useState } from 'react';
import { jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import {
  HandleHeightSizeType,
  HandleResize,
} from '@atlaskit/editor-common/resizer';

import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';

import { resizerStyles } from '@atlaskit/editor-common/styles';

const options: OptionsPropType = [
  { name: 'small', value: 'small', label: 'Small handler' },
  { name: 'medium', value: 'medium', label: 'Medium handler' },
  { name: 'large', value: 'large', label: 'Large handler' },
];

function Parent(props: {
  text: string;
  handleHeightSize: HandleHeightSizeType | undefined;
}): JSX.Element {
  const [width, setWidth] = useState(80);

  const handleResizeStart = () => {};

  const handleResize: HandleResize = (stateOriginal, delta) => {};

  const handleResizeStop: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width;
    setWidth(newWidth);
  };

  return (
    <ResizerNext
      enable={{ left: true, right: true }}
      handleResizeStart={handleResizeStart}
      handleResize={handleResize}
      handleResizeStop={handleResizeStop}
      handleHeightSize={props.handleHeightSize}
      width={width}
      minWidth={20} // we are adding 10px in the handleResizeStop, so the actual min width will be 20+10 = 30px.
      maxWidth={700} // max width will be 700
    >
      <div
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}
      >
        {props.text}
      </div>
    </ResizerNext>
  );
}

export default function Example() {
  const [size, setSize] = useState<HandleHeightSizeType>('medium');

  const onChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    setSize(event.currentTarget.value as HandleHeightSizeType);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '60px',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
      css={resizerStyles}
    >
      <RadioGroup
        isDisabled={false}
        options={options}
        defaultValue={'medium'}
        onChange={onChange}
        aria-labelledby="radiogroup-label"
      />
      <div style={{ display: 'block' }}>
        <Parent text={size} handleHeightSize={size} />
      </div>
    </div>
  );
}
