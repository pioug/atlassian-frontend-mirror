import React from 'react';

import { Counter as CompiledCounter } from '../../components/Counter';

export const CounterCompiled = (): React.JSX.Element => <CompiledCounter value={16} />;

export const CounterUseHighlightCompiled = (): React.JSX.Element => (
	<CompiledCounter value={16} highlight />
);

export const CounterUseDarkerFontCompiled = (): React.JSX.Element => (
	<CompiledCounter value={16} useDarkerFont />
);

export const CounterUseUpdatedStylesCompiled = (): React.JSX.Element => (
	<CompiledCounter value={16} useUpdatedStyles />
);
