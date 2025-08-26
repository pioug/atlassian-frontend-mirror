import React from 'react';

import capitalize from 'lodash/capitalize';

import { ButtonGroup } from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronLeftIcon from '@atlaskit/icon/core/chevron-left';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import ChevronUpIcon from '@atlaskit/icon/core/chevron-up';
import { Stack } from '@atlaskit/primitives/compiled';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { buttonSpacing } from '../src/utils/spacing';

const icons = [ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon];

export default function ChevronIconSizingExample() {
	return (
		<Stack space="space.200" alignInline="start">
			{buttonSpacing.map((s) => (
				<Stack space="space.100" key={s}>
					<Heading size="medium">{capitalize(s)}</Heading>
					<Stack space="space.100" alignInline="start">
						{icons.map((icon) => {
							const Icon = icon;

							return (
								<ButtonGroup key={icon.name}>
									<Button iconBefore={Icon} iconAfter={Icon} spacing={s}>
										Icon before and after
									</Button>
									<IconButton icon={Icon} spacing={s} label="Icon button" />
									{/* Can still be overridden by user render props */}
									<Button
										iconBefore={(iconProps) => <Icon {...iconProps} size="small" />}
										iconAfter={(iconProps) => <Icon {...iconProps} size="small" />}
										spacing={s}
									>
										Render prop overrides
									</Button>
									<IconButton
										icon={(iconProps) => <Icon {...iconProps} size="small" />}
										spacing={s}
										label="Icon button with render prop override"
									/>
								</ButtonGroup>
							);
						})}
					</Stack>
				</Stack>
			))}
		</Stack>
	);
}
