// This file is copied to `packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/ToolbarButton/styles.tsx`
// If you make any change here, copy it to above file as well
//  and notify about the change in #team-fc-editor-ai-dev channel.
import React from 'react';

import Button, { type ButtonProps } from '@atlaskit/button/standard-button';

export default React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
	return (
		<Button
			ref={ref}
			{...props}
			// TODO: (from codemod) Buttons with "component", "css" or "style" prop can't be automatically migrated with codemods. Please migrate it manually.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ alignItems: 'center' }}
		/>
	);
});
