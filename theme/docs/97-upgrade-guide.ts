import { code, md } from '@atlaskit/docs';

export default md`
  ## v9.x.x to v9.3.0 | Breaking Types & Hearts

  This release contains type fixes and documentation improvements.

  ### \`colors\` export

  Previously it was typed as:

${code`
import { colors } from '@atlaskit/theme';
// Record<string, string>
`}

  The keys of the colors are now typed,
  so where before you would not have _any_ intellisense - now you **will**!

  It turns out not all colors are strings,
  some are actually functions!
  Now the themed colors are typed correctly which will break you if you assumed they were strings.

${code`
import { colors } from '@atlaskit/theme';

const key: string = 'B300'; // This would be typed as a string
const color = colors[key]; // Will now error!

// You can fix this by either typing key as the string literal, or accessing it directly.
const key: 'B300' = 'B300';
const color = colors[key]; // No error!
const color1 = colors.B300; // No error!

// 👇 Will now error! It's actually a function!
const background: string = colors.background;
`}

  ### \`elevation\` export

  Previously it was typed as:

${code`
import { elevation } from '@atlaskit/theme';
// Record<string, ThemedValue<string>>
`}

  Like \`colors\` this would not give you any Intellisense - any key is valid according to this type!
  Now they're typed according to the exports.

  ### \`layers\` export

  Previously it was typed as:

  ${code`
  import { layers } from '@atlaskit/theme';
  // Record<string, () => number>
  `}

  Like \`colors\` this would not give you any Intellisense - any key is valid according to this type!
  Now they're typed according to the exports.

  ### \`typography.headingSizes\` export

  Previously it was typed as:

  ${code`
  import { typography } from '@atlaskit/theme';

  typography.headingSizes
  // Record<string, HeadingSize>
  `}

  Like \`colors\` this would not give you any Intellisense - any key is valid according to this type!
  Now they're typed according to the exports.

  Good luck! Remember to raise a ticket over at our [Service Desk](https://ecosystem.atlassian.net/servicedesk/customer/portal/24) if you find anything not working great.

  ## 6.x - 7.x

  *The only breaking changes between these two versions are for experimental APIs.*

  The main \`Theme\` export is now the default export as the component will soon be further paired down (separating out theme tokens, etc).

  ${code`
- import { Theme } from '@atlaskit/theme';
+ import Theme from '@atlaskit/theme';
  `}

  The main \`Theme\` export is the global theme, like before, but does not contain sub-themes for components. Using it now requires you explicitly use the \`Consumer\` and \`Provider\` components on it.

  ${code`
import { Theme } from '@atlaskit/theme';

const Theme = createTheme();

// Getting.
- <Theme>{children}</Theme>
+ <Theme.Consumer>{children}</Theme>

// Setting.
- <Theme values={theme} />
+ <Theme.Provider value={theme} />
  `}

  The new APIs are not synonymous with the old ones as we've changed the approach to how themes are created and applied. For the new API, please refer to the docs.

  ## 5.x - 6.x

  *The only breaking changes between these two versions are for experimental APIs.*

  The only experimental API that changed here is the \`Theme\` component. Themes are no longer components, but functions that return objects.

  ### Theme shape

  Before, you'd pass an object to the \`values\` prop. Now, you pass a function that returns an object.

  ${code`
import { Theme } from '@atlaskit/theme';

- const theme = {
-   mode: 'light'
- }
+ const theme = parentTheme => ({
+   ...parentTheme,
+   mode: 'light'
+ });

<Theme values={theme} />
  `}

  ### Component-specific theme functions

  Component themes are no longer bound, passing in the parent theme. They're now just functions, however you define them, and they can get the parent theme from the execution context of the parent function.

  ${code`
import { Theme } from '@atlaskit/theme';

- const theme = {
-   badge({ appearance }, parentTheme) {
-     return { ... };
-   }
- }
+ const theme = parentTheme => ({
+   badge({ appearance }) {
+     return { ... }
+   }
+ });

<Theme values={theme} />
  `}
`;
