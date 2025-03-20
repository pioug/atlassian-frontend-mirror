import React from 'react';

import { Counter } from '../../../src/components/Counter/Counter';
import { Counter as CompiledCounter } from '../../components/compiled/Counter';

export const CounterLegacy = () => <Counter value={16} />;

export const CounterUseHighlightLegacy = () => <Counter value={16} highlight />;

export const CounterUseDarkerFontLegacy = () => <Counter value={16} useDarkerFont />;

export const CounterUseUpdatedStylesLegacy = () => <Counter value={16} useUpdatedStyles />;

export const CounterCompiled = () => <CompiledCounter value={16} />;

export const CounterUseHighlightCompiled = () => <CompiledCounter value={16} highlight />;

export const CounterUseDarkerFontCompiled = () => <CompiledCounter value={16} useDarkerFont />;

export const CounterUseUpdatedStylesCompiled = () => (
	<CompiledCounter value={16} useUpdatedStyles />
);
