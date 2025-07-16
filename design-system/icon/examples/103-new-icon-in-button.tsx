import React from 'react';

import OldButton from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Inline, Stack, xcss } from '@atlaskit/primitives';

import AddIcon from '../core/add';
import AddIconMigration from '../core/migration/add';
import AddIconOld from '../glyph/add';
import HipchatChevronDownIconOld from '../glyph/hipchat/chevron-down';
import ChevronDownIcon from '../utility/chevron-down';
import ChevronDownIconMigration from '../utility/migration/chevron-down--hipchat-chevron-down';

const styles = xcss({ padding: 'space.200' });
const IconSizeExample = () => {
	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			<Heading size="small">Icon button examples</Heading>
			{[true, false].map((isSelected: boolean) => (
				<>
					<Heading size="xsmall">{isSelected ? 'Selected buttons' : 'Not selected'}</Heading>
					<Inline space="space.100" alignBlock="center">
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIconOld label="" />}
							iconAfter={<HipchatChevronDownIconOld label="" />}
						>
							Button
						</OldButton>
						<OldButton isSelected={isSelected} iconBefore={<AddIconOld label="" />}>
							Button
						</OldButton>
						<OldButton isSelected={isSelected} iconBefore={<AddIconOld label="Add" />} />
						Old button, old icon
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<Button
							isSelected={isSelected}
							iconBefore={AddIconOld}
							iconAfter={HipchatChevronDownIconOld}
						>
							Button
						</Button>
						<Button isSelected={isSelected} iconBefore={AddIconOld}>
							Button
						</Button>
						<IconButton label="add" isSelected={isSelected} icon={AddIconOld} />
						New button, old icon
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIconMigration label="" color="currentColor" />}
							iconAfter={<ChevronDownIconMigration label="" color="currentColor" />}
						>
							Button
						</OldButton>
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIconMigration label="" color="currentColor" />}
						>
							Button
						</OldButton>
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIconMigration label="add" spacing="spacious" color="currentColor" />}
						/>
						Old button, new icon - with legacy fallback (feature flagged)
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<Button
							isSelected={isSelected}
							iconBefore={AddIconMigration}
							iconAfter={ChevronDownIconMigration}
						>
							Button
						</Button>
						<Button isSelected={isSelected} iconBefore={AddIconMigration}>
							Button
						</Button>
						<IconButton isSelected={isSelected} label="add" icon={AddIconMigration} />
						New button, new icon - with legacy fallback (feature flagged)
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIcon label="" color="currentColor" />}
							iconAfter={<ChevronDownIcon label="" color="currentColor" />}
						>
							Button
						</OldButton>
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIcon label="" color="currentColor" />}
						>
							Button
						</OldButton>
						<OldButton
							isSelected={isSelected}
							iconBefore={<AddIcon label="add" spacing="spacious" color="currentColor" />}
						/>
						Old button, new icon
					</Inline>
					<Inline space="space.100" alignBlock="center">
						<Button isSelected={isSelected} iconBefore={AddIcon} iconAfter={ChevronDownIcon}>
							Button
						</Button>
						<Button isSelected={isSelected} iconBefore={AddIcon}>
							Button
						</Button>
						<IconButton isSelected={isSelected} label="add" icon={AddIcon} />
						New button, new icon
					</Inline>
				</>
			))}
		</Stack>
	);
};

export default IconSizeExample;
