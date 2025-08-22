/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { ButtonGroup } from '@atlaskit/button';
import type { Command, FloatingToolbarItem } from '@atlaskit/editor-common/types';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator,
} from '@atlaskit/editor-common/ui';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	marginLeft: 'space.100',
});

type Props = {
	dispatchCommand: (command: Command) => void;
	hide: () => void;
	layoutButtons: FloatingToolbarItem<Command>[];
};

export const LayoutGroup = ({ layoutButtons, dispatchCommand, hide }: Props) => {
	return (
		<Box xcss={containerStyles}>
			<ButtonGroup>
				{layoutButtons.map((item, idx) => {
					switch (item.type) {
						case 'separator':
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							return <FloatingToolbarSeparator key={idx} />;
						case 'button':
							// Ignored via go/ees005
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const ButtonIcon = item.icon as React.ComponentClass<any>;
							return (
								<Button
									// Ignored via go/ees005
									// eslint-disable-next-line react/no-array-index-key
									key={idx}
									icon={item.icon ? <ButtonIcon label={item.title} /> : undefined}
									title={item.title}
									selected={item.selected}
									disabled={item.disabled}
									onClick={() => {
										dispatchCommand(item.onClick);
										hide();
									}}
								/>
							);
					}
				})}
			</ButtonGroup>
		</Box>
	);
};
