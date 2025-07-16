import React from 'react';

import capitalize from 'lodash/capitalize';

import { ButtonGroup } from '@atlaskit/button';
import Button from '@atlaskit/button/new';
import AddIcon from '@atlaskit/icon/glyph/add';
import ArrowLeftIcon from '@atlaskit/icon/glyph/arrow-left';
import ArrowRightIcon from '@atlaskit/icon/glyph/arrow-right';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import GraphLineIcon from '@atlaskit/icon/glyph/graph-line';
import LightbulbIcon from '@atlaskit/icon/glyph/lightbulb';
import MoreIcon from '@atlaskit/icon/glyph/more';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { type IconSize } from '../src/new-button/variants/types';
// eslint-disable-next-line @atlaskit/platform/use-entrypoints-in-examples
import { buttonSpacing } from '../src/utils/spacing';

const icons = [
	AddIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	ChevronDownIcon,
	GraphLineIcon,
	LightbulbIcon,
	MoreIcon,
];

const iconSizes: IconSize[] = ['small', 'large', 'xlarge'];

export default function ButtonsWithIconBeforeOrAfterExample() {
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
							<AddIcon {...iconProps} size={size} primaryColor={token('color.icon.accent.blue')} />
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
