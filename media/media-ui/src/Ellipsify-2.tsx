import React from 'react';

import { Ellipsify as CompiledEllipsify } from './Ellipsify-3';

export const Ellipsify: typeof CompiledEllipsify = (props) => <CompiledEllipsify {...props} />;
