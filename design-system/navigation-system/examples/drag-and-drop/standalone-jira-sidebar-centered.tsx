/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@atlaskit/css';

import { Sidebar } from './jira/sidebar';
import { SidebarExampleContainer } from './sidebar-example-container';

const styles = css({
	display: 'flex',
	width: '100%',
	justifyContent: 'center',
	flexDirection: 'row',
});

export function StandaloneJiraSidebarCentered() {
	return (
		<div css={styles}>
			<SidebarExampleContainer>
				<Sidebar />
			</SidebarExampleContainer>
		</div>
	);
}
