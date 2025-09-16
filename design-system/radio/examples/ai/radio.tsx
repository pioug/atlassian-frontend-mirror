/* eslint-disable no-console, import/no-anonymous-default-export */
import React from 'react';

import { Radio } from '@atlaskit/radio';

export default () => (
	<Radio value="option1" label="Option 1" name="choices" onChange={() => console.log('Changed!')} />
);
