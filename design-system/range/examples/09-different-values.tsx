import React from 'react';

import Range from '../src';

const baseProps = {
  min: -50,
  max: 50,
};

const RangeValues = () => (
  <div data-testid="container">
    <section>
      <h5>0%</h5>
      <Range {...baseProps} value={-50} />
    </section>
    <section>
      <h5>25%</h5>
      <Range {...baseProps} value={-25} />
    </section>
    <section>
      <h5>50%</h5>
      <Range {...baseProps} value={0} />
    </section>
    <section>
      <h5>75%</h5>
      <Range {...baseProps} value={25} />
    </section>
    <section>
      <h5>100%</h5>
      <Range {...baseProps} value={50} />
    </section>
    <section>
      <h5>
        Correct display if <code>value</code> &lt; <code>min</code>
      </h5>
      <Range {...baseProps} value={-100} />
    </section>
    <section>
      <h5>
        Correct display if <code>value</code> &gt; <code>max</code>
      </h5>
      <Range {...baseProps} value={100} />
    </section>
    <section>
      <h5>Correctly rounding blue track width to align with thumb</h5>
      {/* Cases which were previously identified to have issues */}
      <Range value={30} min={-50} max={50} step={20} />
      <Range value={42.5} min={30} max={80} step={1} />
      <Range value={42.5} min={30} max={80} step={10} />
    </section>
  </div>
);

export default RangeValues;
