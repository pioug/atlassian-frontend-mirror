import { components } from './components.codegen';
import type { ComponentMcpPayload } from './types';

export function loadAllComponents(): ComponentMcpPayload[] {
	return components;
}
