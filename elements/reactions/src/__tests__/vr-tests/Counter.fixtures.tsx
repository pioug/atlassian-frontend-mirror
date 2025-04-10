import React from 'react';

import { Counter as CompiledCounter } from '../../components/Counter';

export const CounterCompiled = () => <CompiledCounter value={16} />;

export const CounterUseHighlightCompiled = () => <CompiledCounter value={16} highlight />;

export const CounterUseDarkerFontCompiled = () => <CompiledCounter value={16} useDarkerFont />;

export const CounterUseUpdatedStylesCompiled = () => (
	<CompiledCounter value={16} useUpdatedStyles />
);
