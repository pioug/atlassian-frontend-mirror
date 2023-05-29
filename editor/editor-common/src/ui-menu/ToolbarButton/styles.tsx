// This file is copied to `packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/ToolbarButton/styles.tsx`
// If you make any change here, copy it to above file as well
//  and notify about the change in #team-fc-editor-ai-dev channel.
import React from 'react';

import Button, { ButtonProps } from '@atlaskit/button/standard-button';

export default React.forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  return <Button ref={ref} {...props} style={{ alignItems: 'center' }} />;
});
