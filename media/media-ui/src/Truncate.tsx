import React from 'react';

import { Truncate as CompiledTruncate } from './Truncate-compiled';

export const Truncate: typeof CompiledTruncate = (props) => <CompiledTruncate {...props} />;
