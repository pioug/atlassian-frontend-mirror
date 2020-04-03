import React, { FC, Fragment, ReactNode, useRef } from 'react';
import Btn from '@atlaskit/button';

import Select from '../src';

const Button = ({
  inline = true,
  ...props
}: {
  inline?: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <div
    style={{
      display: inline ? 'inline-block' : 'block',
      paddingRight: 8,
      paddingTop: 8,
    }}
  >
    <Btn {...props} />
  </div>
);

const FocusBlurSelect: FC = () => {
  const selectRef = useRef<any | null>(null);

  const focus = () => {
    if (selectRef && selectRef.current) {
      selectRef.current.focus();
    }
  };

  const blur = () => {
    if (selectRef && selectRef.current) {
      selectRef.current.blur();
    }
  };

  return (
    <Fragment>
      <Select
        ref={selectRef}
        options={[
          { label: 'Adelaide', value: 'adelaide' },
          { label: 'Brisbane', value: 'brisbane' },
          { label: 'Canberra', value: 'canberra' },
          { label: 'Darwin', value: 'darwin' },
          { label: 'Hobart', value: 'hobart' },
          { label: 'Melbourne', value: 'melbourne' },
          { label: 'Perth', value: 'perth' },
          { label: 'Sydney', value: 'sydney' },
        ]}
        placeholder="Choose a City"
      />
      <div>
        <Button onClick={focus}>Focus</Button>
        <Button onClick={blur}>Blur</Button>
      </div>
    </Fragment>
  );
};

export default FocusBlurSelect;
