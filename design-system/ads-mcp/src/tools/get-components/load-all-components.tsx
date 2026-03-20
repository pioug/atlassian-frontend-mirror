import { fg } from '@atlaskit/platform-feature-flags';

import { components } from './components';
import { components as componentsStructuredContent } from './components.codegen';
import type { ComponentMcpPayload } from './types';

export function loadAllComponents(): ComponentMcpPayload[] {
	let mcpComponents: ComponentMcpPayload[] = components;
	if (fg('design_system_mcp_structured_content')) {
		mcpComponents = componentsStructuredContent;
	}

	return mcpComponents;
}
