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

## Responsive top-nav buttons

Use \`ResponsiveTopNavButton\` from \`@atlaskit/navigation-system/top-nav-items/responsive-button\`
for an action that should become an icon button at xs and xxs widths:

\`\`\`tsx
<ResponsiveTopNavButton
  iconButton={TopNavIconButton}
  icon={() => <RovoIcon label="" size="xxsmall" />}
  label="Ask Rovo"
  onClick={onClick}
/>
\`\`\`

With \`platform-dst-chat-panel-layout\` enabled, the enclosing top nav's border-box width determines
the presentation: below 48rem it shows only the icon; at 48rem and above it also shows the label.
With the gate disabled or outside TopNav, it uses the text presentation. The supplied
icon-button component stays mounted and receives \`shouldShowLabel\`. Custom components must forward
that prop and their ref to TopNavIconButton. Keeping the same button element preserves keyboard
focus and open-popup focus management across resizing.
The breakpoint also updates when the root font size changes without resizing the top nav.
Use \`tooltip\` to configure the compact icon button’s tooltip (for example, its content or delay).
Compact buttons show their label in a tooltip by default, including on keyboard focus.
Both default and custom themes support opting out with \`isTooltipDisabled={true}\`.
These options apply only to the icon presentation; the text button does not render a tooltip.

Button label visibility remains a React rendering decision, using the same private 48rem
measurement as action overflow. Layout and logo presentation use CSS container queries.
Measurements run in a layout effect, with ref registration and breakpoint updates published as
transitions so pending Suspense boundaries can finish hydrating. During SSR, container width is unknown,
so the server and initial hydration render use an accessible icon-only fallback. This prevents
Create and Rovo labels from overlapping other controls on narrow containers. Wide navigation
therefore shows icons until hydration and the measurement transition restore the text presentation.
Only one button per action is rendered; gate-off and outside-TopNav behavior still uses text.
The complete hydrated composition follows the spec’s 320px minimum container width. Below
320px, a full row including a 32px Search control can still overlap after the overflow trigger
appears; the compact server fallback does not change that existing layout limitation.

## Top-nav spacing

With \`platform-dst-chat-panel-layout\` enabled, \`TopNavEnd\` separates its regular actions
from \`persistentItems\` by 8px (\`space.100\`). Place Rovo in \`persistentItems\` after Profile
so this is the Profile-to-Rovo gap. On small viewports, the same 8px separates the overflow
button from Rovo. Hide the persistent group's outermost element when the trigger self-hides,
so it does not leave an empty gap.

Spacing within the regular end actions stays 4px (\`space.050\`). Middle items stay 8px apart,
and the minimum gap between the middle and end areas stays 8px. The responsive Rovo example
shows the 4px action group and the 8px Profile-to-Rovo gap using a simple navigation group.
The gate-off layout is unchanged.

See [Specs: Top nav changes](https://hello.atlassian.net/wiki/spaces/DST/pages/7541389190/Specs+Top+nav+changes).

## Create in product navigation

Use \`UniversalCreateButton\` from \`@atlassian/universal-create/UniversalCreateButton\` for the
product's global Create action. Confluence supplies its menu sections and creation handlers to
this shared component. Global Top Navigation also supplies it as \`CreateComponent\` through
\`CreateSlot\`.

\`\`\`tsx
import { UniversalCreateButton } from '@atlassian/universal-create/UniversalCreateButton';

<UniversalCreateButton product="confluence" sections={menuSections}>
  Create
</UniversalCreateButton>
\`\`\`

The responsive Rovo example uses \`buttonOnly\` to demonstrate the shared Create trigger without
wiring a product menu. In product integration, supply \`sections\` for the menu, or use
\`buttonOnly\` with \`onClick\` when the app owns the creation flow.

Universal Create currently switches between its text and icon presentations at the 48rem
**viewport** breakpoint using media queries. Changing only the top-nav container width does
not change its presentation. \`ResponsiveTopNavButton\` uses the enclosing **container** width
instead. This Rovo change does not migrate Universal Create to container-based responsiveness.

The placeholder navigation-system \`CreateButton\` also uses container-based responsiveness
under \`platform-dst-chat-panel-layout\`: below 48rem it shows only the add icon, and at 48rem
and above it shows the icon and its children. Its children provide the accessible label in both
presentations. With the gate off or outside \`TopNav\`, it keeps the text presentation.
This placeholder does not provide Universal Create's menu or product integration. Use the
example's Create implementation selector to compare the two.
`;
export default _default_1;
