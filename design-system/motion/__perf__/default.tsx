import React from 'react';

import { MovesRightBlock } from '../examples-utils/blocks';
import { easeIn } from '../src';

export default () => <MovesRightBlock curve={easeIn} duration={1000} />;
