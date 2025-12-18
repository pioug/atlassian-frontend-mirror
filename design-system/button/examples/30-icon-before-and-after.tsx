import React from 'react';

import capitalize from 'lodash/capitalize';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/core/add';
import ArrowLeftIcon from '@atlaskit/icon/core/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/core/arrow-right';
import ChartTrendUpIcon from '@atlaskit/icon/core/chart-trend-up';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import MoreIcon from '@atlaskit/icon/core/show-more-horizontal';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { type IconSize } from '@atlaskit/icon/types';
import { Stack } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { buttonSpacing } from '../src/utils/spacing';

const icons = [
	AddIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronDownIcon,
	ChartTrendUpIcon,
	LightbulbIcon,
	MoreIcon,
];

const iconSizes: IconSize[] = ['small', 'medium'];

export default function ButtonsWithIconBeforeOrAfterExample(): React.JSX.Element {
	return (
		<Stack space="space.200" alignInline="start">
			{buttonSpacing.map((s) => (
				<Stack space="space.100" key={s}>
					<h2>{capitalize(s)}</h2>
					<Stack space="space.100" alignInline="start">
						{icons.map((icon) => {
							const Icon = icon;

							return (
								<ButtonGroup key={icon.name}>
									<Button iconBefore={Icon} spacing={s}>
										Icon before
									</Button>
									<Button iconAfter={Icon} spacing={s}>
										Icon after
									</Button>
									<Button iconBefore={Icon} iconAfter={Icon} spacing={s}>
										Icon before
									</Button>
								</ButtonGroup>
							);
						})}
					</Stack>
				</Stack>
			))}
			<h2>Icon render prop</h2>
			{iconSizes.map((size) => (
				<ButtonGroup key={size}>
					<Button
						iconBefore={(iconProps) => (
							<AddIcon {...iconProps} size={size} color={token('color.icon.accent.blue')} />
						)}
					>
						Icon before
					</Button>
					<Button iconAfter={(iconProps) => <AddIcon {...iconProps} size={size} />}>
						Icon after
					</Button>
					<Button
						iconBefore={(iconProps) => <AddIcon {...iconProps} size={size} />}
						iconAfter={(iconProps) => <AddIcon {...iconProps} size={size} />}
					>
						Icon before and after
					</Button>
				</ButtonGroup>
			))}
		</Stack>
	);
}
