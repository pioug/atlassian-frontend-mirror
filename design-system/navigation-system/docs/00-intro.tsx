import React from 'react';

import { md } from '@atlaskit/docs';
import Link from '@atlaskit/link/link';
import SectionMessage from '@atlaskit/section-message/message';

const _default_1: any = md`
${(
	<SectionMessage appearance="information">
		This component is documented on{' '}
		<Link href="https://atlassian.design/components/navigation-system">atlassian.design</Link>
	</SectionMessage>
)}

## Container-based top-nav layout

With \`platform-dst-chat-panel-layout\` enabled, the grid, logo/title and end-action overflow
follow the enclosing TopNav width, including when a chat panel narrows it on a wide viewport.
The shared Search trigger uses the same CSS container queries: icon-only below 30rem, and a
text field above it. Long translated labels truncate within the field without overlapping its icon.
This presentation works before hydration, with viewport behavior retained when the gate is off.
Below 48rem, end actions move into the more menu while Rovo stays outside it. Below 64rem,
logo text and the desktop start/end minimum widths collapse. Existing 4px/8px spacing is retained.

Presentation uses CSS container queries, so the grid, logo/title visibility and alignment
respond before hydration, without React updates. A private shared measurement handles only
React rendering decisions such as moving actions into the overflow popup. That measurement
also responds to root font-size changes; the initial server render uses inline actions,
which CSS hides on compact containers until the overflow trigger hydrates.
DOM ref registration and breakpoint updates use React transitions, preserving server-rendered
navigation while a Suspense boundary waits for code or data. CSS presentation still responds immediately.

## Top-nav spacing

With \`platform-dst-chat-panel-layout\` enabled, \`TopNavEnd\` separates its regular actions
from \`persistentItems\` by 8px (\`space.100\`). Place Rovo in \`persistentItems\` after Profile
so this is the Profile-to-Rovo gap. On small viewports, the same 8px separates the overflow
button from Rovo. Hide the persistent group's outermost element when the trigger self-hides,
so it does not leave an empty gap.

Spacing within the regular end actions stays 4px (\`space.050\`). Middle items stay 8px apart,
and the minimum gap between the middle and end areas stays 8px. The gate-off layout is unchanged.

See [Specs: Top nav changes](https://hello.atlassian.net/wiki/spaces/DST/pages/7541389190/Specs+Top+nav+changes).

`;
export default _default_1;
