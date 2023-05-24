/** @jsx jsx */
import { useCallback, SyntheticEvent, useState } from 'react';
import { jsx } from '@emotion/react';

import { ResizerNext } from '@atlaskit/editor-common/resizer';
import { HandlerHeightSizeType } from '@atlaskit/editor-common/resizer';

import { RadioGroup } from '@atlaskit/radio';
import { OptionsPropType } from '@atlaskit/radio/types';

import { resizerStyles } from '@atlaskit/editor-common/styles';

const options: OptionsPropType = [
  { name: 'small', value: 'small', label: 'Small handler' },
  { name: 'medium', value: 'medium', label: 'Medium handler' },
  { name: 'large', value: 'large', label: 'Large hander' },
];

export type HandleResize = (
  stateOriginal: { x: number; y: number; width: number; height: number },
  delta: { width: number; height: number },
) => number;

function Parent(props: {
  text: string;
  handlerHeightSize: HandlerHeightSizeType | undefined;
}): JSX.Element {
  const [width, setWidth] = useState(80);

  const handleResizeStart = () => {
    const newWidth = 55;
    return newWidth;
  };

  const handleResize: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 5;
    return newWidth;
  };

  const handleResizeStop: HandleResize = (stateOriginal, delta) => {
    const newWidth = stateOriginal.width + delta.width + 10;
    setWidth(newWidth);
    return newWidth;
  };

  return (
    <ResizerNext
      enable={{ left: true, right: true }}
      handleResizeStart={handleResizeStart}
      handleResize={handleResize}
      handleResizeStop={handleResizeStop}
      handlerHeightSize={props.handlerHeightSize}
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
  const [size, setSize] = useState<HandlerHeightSizeType>('medium');

  const onChange = useCallback((event: SyntheticEvent<HTMLInputElement>) => {
    setSize(event.currentTarget.value as HandlerHeightSizeType);
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
        <Parent text={size} handlerHeightSize={size} />
      </div>
    </div>
  );
}
