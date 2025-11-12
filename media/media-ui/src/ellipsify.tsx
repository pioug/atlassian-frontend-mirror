import React from 'react';
import { Ellipsify as CompiledEllipsify } from './ellipsify-compiled';

export const Ellipsify: typeof CompiledEllipsify = (props) => <CompiledEllipsify {...props} />;

export type { EllipsifyProps } from './ellipsify-compiled';

export default Ellipsify;
