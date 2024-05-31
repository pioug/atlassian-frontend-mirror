/** @jsx jsx */
import { jsx } from '@emotion/react';

import { ButtonGroup } from '@atlaskit/button';
import type { Command, FloatingToolbarItem } from '@atlaskit/editor-common/types';
import {
	FloatingToolbarButton as Button,
	FloatingToolbarSeparator,
} from '@atlaskit/editor-common/ui';
import { Box, xcss } from '@atlaskit/primitives';

const containerStyles = xcss({
	marginLeft: 'space.100',
});

type Props = {
	alignmentButtons: FloatingToolbarItem<Command>[];
	dispatchCommand: (command: Command) => void;
};

export const FloatingAlignmentButtons = ({ alignmentButtons, dispatchCommand }: Props) => {
	return (
		<Box xcss={containerStyles}>
			<ButtonGroup>
				{alignmentButtons.map((item, idx) => {
					switch (item.type) {
						case 'separator':
							return <FloatingToolbarSeparator key={idx} />;
						case 'button':
							const ButtonIcon = item.icon as React.ComponentClass<any>;
							return (
								<Button
									key={idx}
									icon={item.icon ? <ButtonIcon label={item.title} /> : undefined}
									title={item.title}
									selected={item.selected}
									disabled={item.disabled}
									onClick={() => {
										dispatchCommand(item.onClick);
									}}
								/>
							);
					}
				})}
			</ButtonGroup>
		</Box>
	);
};
