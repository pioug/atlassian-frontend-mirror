import React from 'react';

import { easeIn } from '../src';

import { MovesRightBlock } from './utils/blocks';

export default () => <MovesRightBlock curve={easeIn} duration={1000} />;
