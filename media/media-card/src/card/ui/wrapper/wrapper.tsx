import React from 'react';
import { type WrapperProps } from './types';
import { Wrapper as CompiledWrapper } from './wrapper-compiled';

export const Wrapper = (props: WrapperProps): React.JSX.Element => <CompiledWrapper {...props} />;
