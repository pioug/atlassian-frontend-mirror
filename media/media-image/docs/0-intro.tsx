/**@jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { md, AtlassianInternalWarning } from '@atlaskit/docs';
import { DocsContentTabs } from '@atlaskit/media-test-helpers';
import example from '../content/example';
import props from '../content/props';

export default md`
  ${(<AtlassianInternalWarning />)}

  This package exports \`MediaImage\` component using
  [render prop pattern](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

  The render prop is called whenever the requested image status was changed.
  e.g. when the component is rendered it triggers the request and add the image status
  as \`loading\` and it changes to \`succeeded\` when Media API returns the image src
  data or image preview is available.

  This package is required by other Media Components, and should not be used
  directly.

  ${(
		<DocsContentTabs
			tabs={[
				{ name: 'Usage', content: example },
				{ name: 'Props', content: props },
			]}
		/>
	)}
`;
