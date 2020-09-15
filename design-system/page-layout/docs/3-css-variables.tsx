import { md } from '@atlaskit/docs';

export default md`
## Using CSS variables

page-layout exports a set of variables that can be used to setup the grid on non-react pages. The following variables are exported:

- LEFT_PANEL_WIDTH
- RIGHT_PANEL_WIDTH
- LEFT_SIDEBAR_WIDTH
- RIGHT_SIDEBAR_WIDTH
- TOP_NAVIGATION_HEIGHT
- BANNER_HEIGHT
- LEFT_SIDEBAR_FLYOUT_WIDTH

Always use these variabels instead of accessing the css-variable names directly because these variables have sensible fallback values baked into them. Accessing the variables directly runs the risk of setting the intended styles to "unset" which can cause unintended styling issues.

See the [server rendered example](/examples/design-system/page-layout/server-rendered) for a more complete example of how to use these variables.
`;
