import React from 'react';

// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const styles = xcss({ width: '360px' });

export const AgentProfileCardWrapper = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles}>{children}</Box>;
};
