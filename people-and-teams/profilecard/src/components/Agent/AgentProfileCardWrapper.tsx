import React from 'react';

import { Box, xcss } from '@atlaskit/primitives';

const styles = xcss({ width: '360px', borderRadius: '6px' });

export const AgentProfileCardWrapper = ({ children }: { children: React.ReactNode }) => {
	return <Box xcss={styles}>{children}</Box>;
};
