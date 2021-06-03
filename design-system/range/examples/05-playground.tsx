import React, { Fragment, useState } from 'react';

import { Checkbox } from '@atlaskit/checkbox';
import { N80 } from '@atlaskit/theme/colors';

import Range from '../src';

const initialState = {
  min: 0,
  max: 100,
  step: 1,
  actualVal: 50,
  isDisabled: false,
  rtl: false,
};

function Playground() {
  const [min, setMin] = useState(initialState.min);
  const [max, setMax] = useState(initialState.max);
  const [step, setStep] = useState(initialState.step);
  const [actualVal, setActualVal] = useState(initialState.actualVal);
  const [isDisabled, setIsDisabled] = useState(initialState.isDisabled);
  const [rtl, setRtl] = useState(initialState.rtl);

  return (
    <Fragment>
      <p>Example Range (current value is {actualVal}):</p>
      <div dir={rtl ? 'rtl' : 'ltr'}>
        <Range
          min={min}
          max={max}
          step={step}
          value={actualVal}
          isDisabled={isDisabled}
          onChange={(newVal) => setActualVal(newVal)}
        />
      </div>
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: N80,
          margin: '20px',
        }}
      />
      <Checkbox
        value="Toggle Disabled"
        label="Toggle Disabled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setIsDisabled(event.target.checked)
        }
        name="toggle-disabled"
      />
      <Checkbox
        value="Toggle right-to-left"
        label="Toggle right-to-left"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setRtl(event.target.checked)
        }
        name="toggle-rtl"
      />
      <p>The ranges below control the values in the range above</p>
      <p>Change minimum value (currently at {min})</p>
      <Range
        max={max}
        defaultValue={initialState.min}
        step={1}
        onChange={(newMin) => setMin(newMin)}
      />
      <p>Change maximum value (currently at {max})</p>
      <Range
        min={min}
        defaultValue={initialState.max}
        max={500}
        step={1}
        onChange={(newMax) => setMax(newMax)}
      />
      <p>Change step distance (currently at {step})</p>
      <Range
        max={50}
        defaultValue={initialState.step}
        onChange={(newStep) => setStep(newStep)}
      />
    </Fragment>
  );
}

export default Playground;
