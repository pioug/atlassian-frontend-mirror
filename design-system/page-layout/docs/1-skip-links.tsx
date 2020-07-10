import React from 'react';

import { Example, md } from '@atlaskit/docs';

export default md`

## Skip Links

Skip links are hidden links that appear on focus and allow people to skip content on the
page. We recommend implementing skip links for pages with complex navigation layouts as
they allow people navigating by keyboard to skip to different sections of the page.

Page layout automatically generates a global skip link menu based on the sections included
inside page-layout. To add a section to the skip link menu, give it an \`id\` to allow focus to
be placed on the element, and a \`skipLinkTitle\` for the text used to describe the section.
Screen readers will read the \`skipLinkTitle\` with the text 'skip to' prepended for context.

## Behaviour

The skip links menu:
- appears on keyboard focus and is the first focusable item on the page
- can be closed by pressing escape, which brings focus to the first element after the skip link menu
- lists all PageLayout sections that have \`skipLinkTitle\` and \`id\` props set
- uses a focus ring when a link is selected to highlight the selection

To modify the "Skip to:" text, set the \`skipLinksI18n\` prop in \`PageLayout\`.

On first tab into the example below, you should see the skip link menu appear:

${(
  <Example
    packageName="@atlaskit/page-layout"
    Component={require('../examples/01-basic-page-layout').default}
    title="Basic page layout with skip link menu"
    source={require('!!raw-loader!../examples/01-basic-page-layout')}
  />
)}

### Accessibility
Make sure there are **no more than 4 or 5 elements** in the skip link menu unless absolutely necessary.
Too many options increases cognitive load and requires too many tab presses to bypass the skip link menu.

A skip link menu should be **present** for pages where a substantial number of tab presses is required
to reach the main content. A log-in page may not require a skip link menu, but on any page with top
and/or side navigation people will expect to be able to skip to the main content.

Keep the list **consistent**. If a section of the UI (such as a side panel) is in a skip link menu on one
page it should be in the skip links menu on all pages where it appears.

Names for the sections must be **understandable**, including for screen reader users. 'Top navigation' does
not describe the purpose of the navigation element, while 'Jira navigation' or 'global navigation' is more
descriptive.

All skip link text needs to be **translated** for different locales. This includes section skip link labels, as
well as the 'skip to:' text at the top of the panel.
`;
