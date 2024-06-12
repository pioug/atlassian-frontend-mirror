import React, { type ComponentProps } from 'react';
import OldButton from '@atlaskit/button';
import Button, { IconButton } from '@atlaskit/button/new';

import AddIconOld from '../../glyph/add';
import ChevronDownOld from '../../glyph/hipchat/chevron-down';
import AddIcon from '../../core/add';
import ChevronDownIcon from '../../utility/chevron-down';

import Heading from '@atlaskit/heading';
import { Inline, Stack, xcss } from '@atlaskit/primitives';

const FFAddIcon = (props: ComponentProps<typeof AddIcon>) => (
	<AddIcon
		spacing="none"
		LEGACY_fallbackIcon={AddIconOld}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

const FFChevronDownIcon = (props: ComponentProps<typeof AddIcon>) => (
	<ChevronDownIcon
		spacing="none"
		LEGACY_fallbackIcon={ChevronDownOld}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
	/>
);

const styles = xcss({ padding: 'space.100' });
const IconSizeExample = () => {
	return (
		<>
			<Stack space="space.200" alignInline="start" xcss={styles}>
				{[true, false].map((isSelected: boolean) => (
					<>
						<Heading size="xsmall">{isSelected ? 'Selected buttons' : 'Not selected'}</Heading>
						<Inline space="space.100" alignBlock="center">
							<OldButton
								iconBefore={<FFAddIcon label="" color="currentColor" />}
								iconAfter={<FFChevronDownIcon label="" color="currentColor" />}
								isSelected={isSelected}
							>
								Button
							</OldButton>
							<OldButton
								iconBefore={<FFAddIcon label="" color="currentColor" />}
								isSelected={isSelected}
							>
								Button
							</OldButton>
							<OldButton
								iconBefore={<FFAddIcon label="add" spacing="spacious" color="currentColor" />}
								isSelected={isSelected}
							/>
							Old button, new icon - with legacy fallback (feature flagged)
						</Inline>
						<Inline space="space.100" alignBlock="center">
							<Button iconBefore={FFAddIcon} iconAfter={FFChevronDownIcon} isSelected={isSelected}>
								Button
							</Button>
							<Button iconBefore={FFAddIcon} isSelected={isSelected}>
								Button
							</Button>
							<IconButton label="add" icon={FFAddIcon} isSelected={isSelected} />
							New button, new icon - with legacy fallback (feature flagged)
						</Inline>
						<Inline space="space.100" alignBlock="center">
							<OldButton
								iconBefore={<AddIcon label="" color="currentColor" />}
								iconAfter={<ChevronDownIcon label="" color="currentColor" />}
								isSelected={isSelected}
							>
								Button
							</OldButton>
							<OldButton
								iconBefore={<AddIcon label="" color="currentColor" />}
								isSelected={isSelected}
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
		</>
	);
};

export default IconSizeExample;
