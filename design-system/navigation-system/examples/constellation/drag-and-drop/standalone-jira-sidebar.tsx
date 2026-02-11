/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@atlaskit/css';

import { Sidebar } from './jira/sidebar';
import { SidebarExampleContainer } from './sidebar-example-container';

export function StandaloneJiraSidebar(): JSX.Element {
	return (
		<SidebarExampleContainer>
			<Sidebar />
		</SidebarExampleContainer>
	);
}
