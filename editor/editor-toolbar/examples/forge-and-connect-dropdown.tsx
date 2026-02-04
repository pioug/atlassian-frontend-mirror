import React from 'react';


import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { MoreItemsIcon } from '../src/ui/icons/MoreItemsIcon';
import { Toolbar } from '../src/ui/Toolbar';
import { ToolbarDropdownItem } from '../src/ui/ToolbarDropdownItem';
import { ToolbarDropdownItemSection } from '../src/ui/ToolbarDropdownItemSection';
import { ToolbarDropdownMenu } from '../src/ui/ToolbarDropdownMenu';
import { ToolbarSection } from '../src/ui/ToolbarSection';

const styles = cssMap({
	container: {
		paddingTop: token('space.400'),
		paddingBottom: token('space.400'),
		paddingRight: token('space.200'),
		paddingLeft: token('space.200'),
	},
});

const ForgeAndConnectItems = (): React.JSX.Element => {
	return (
			<Toolbar label="Editor Toolbar">
				<ToolbarSection>
                    <ToolbarDropdownMenu iconBefore={<MoreItemsIcon label="More options" />}>
                        <ToolbarDropdownItemSection>
                            <ToolbarDropdownItem
                                title="Connect App"
                                href="https://www.google.com"
                                data-vc="menuitem"
                                data-key="connect-app"
                                data-testid="connect-app-test-id"
                            >
                            Connect App
                            </ToolbarDropdownItem>
                            <ToolbarDropdownItem
                                title="Forge App 1"
                                data-key="forge-app-1"
                                data-testid="forge-app-1-test-id"
                            >
                            Forge App
                            </ToolbarDropdownItem>
                            <ToolbarDropdownItem
                                title="Forge App 2"
                                data-key="forge-app-2"
                                data-testid="forge-app-2-test-id"
                            >
                            Forge App
                            </ToolbarDropdownItem>
                            <ToolbarDropdownItem
                                title="Forge App 3"
                                data-key="forge-app-3"
                                data-testid="forge-app-3-test-id"
                            >
                            Forge App
                            </ToolbarDropdownItem>
                        </ToolbarDropdownItemSection>
                    </ToolbarDropdownMenu>
                </ToolbarSection>
            </Toolbar>
        )
};


const App = (): React.JSX.Element => {
	return (
		<Box xcss={styles.container}>
			<ForgeAndConnectItems />
		</Box>
	);
};

export default App;
