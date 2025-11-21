import React from 'react';

import Range from '@atlaskit/range';

const RangeDisabledExample = (): React.JSX.Element => {
	return <Range aria-label="disabled range" isDisabled step={1} min={1} max={100} />;
};

export default RangeDisabledExample;
