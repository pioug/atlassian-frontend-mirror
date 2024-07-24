import React from 'react';

import Heading from '@atlaskit/heading';
import { Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import AddIcon from '../core/add';
import AudioIcon from '../core/audio';
import CrossIcon from '../core/cross-circle';
import AddCircleIconOld from '../glyph/add-circle';
import AudioCircleIconOld from '../glyph/audio-circle';
import SelectClearIconOld from '../glyph/select-clear';

const styles = xcss({ padding: 'space.200' });
const LegacyIconColorExample = () => {
	return (
		<Stack space="space.200" alignInline="start" xcss={styles}>
			<Heading size="small">LEGACY_primaryColor Examples</Heading>

			<Inline space="space.100">
				<AudioIcon
					label=""
					spacing="none"
					LEGACY_size="small"
					LEGACY_fallbackIcon={AudioCircleIconOld}
					color={token('color.icon.brand')}
				/>
				<CrossIcon
					label=""
					LEGACY_fallbackIcon={SelectClearIconOld}
					LEGACY_size="medium"
					color={token('color.icon.brand')}
				/>
				<AddIcon
					label=""
					spacing="spacious"
					LEGACY_fallbackIcon={AddCircleIconOld}
					color={token('color.icon.brand')}
				/>
				New icons with legacy fallback (feature flagged) - LEGACY_primaryColor not set, color set to
				color.icon.brand
			</Inline>

			<Inline space="space.100">
				<AudioIcon
					label=""
					spacing="none"
					LEGACY_size="small"
					LEGACY_fallbackIcon={AudioCircleIconOld}
					color={token('color.icon.brand')}
					LEGACY_primaryColor={token('color.icon.danger')}
				/>
				<CrossIcon
					label=""
					LEGACY_fallbackIcon={SelectClearIconOld}
					LEGACY_size="medium"
					color={token('color.icon.brand')}
					LEGACY_primaryColor={token('color.icon.danger')}
				/>
				<AddIcon
					label=""
					spacing="spacious"
					LEGACY_fallbackIcon={AddCircleIconOld}
					color={token('color.icon.brand')}
					LEGACY_primaryColor={token('color.icon.danger')}
				/>
				New icons with legacy fallback (feature flagged) - LEGACY_primaryColor set to
				color.icon.danger, color set to color.icon.brand
			</Inline>

			<Heading size="small">LEGACY_secondaryColor Examples</Heading>

			<Inline space="space.100">
				<AudioIcon
					label=""
					spacing="none"
					LEGACY_size="small"
					LEGACY_fallbackIcon={AudioCircleIconOld}
					color={token('color.icon.brand')}
				/>
				<CrossIcon
					label=""
					LEGACY_fallbackIcon={SelectClearIconOld}
					LEGACY_size="medium"
					color={token('color.icon.brand')}
				/>
				<AddIcon
					label=""
					spacing="spacious"
					LEGACY_fallbackIcon={AddCircleIconOld}
					color={token('color.icon.brand')}
				/>
				New icons with legacy fallback (feature flagged) - LEGACY_secondaryColor not set, color set
				to color.icon.brand
			</Inline>

			<Inline space="space.100">
				<AudioIcon
					label=""
					spacing="none"
					LEGACY_size="small"
					LEGACY_fallbackIcon={AudioCircleIconOld}
					color={token('color.icon.brand')}
					LEGACY_secondaryColor={token('color.icon.danger')}
				/>
				<CrossIcon
					label=""
					LEGACY_fallbackIcon={SelectClearIconOld}
					LEGACY_size="medium"
					color={token('color.icon.brand')}
					LEGACY_secondaryColor={token('color.icon.danger')}
				/>
				<AddIcon
					label=""
					spacing="spacious"
					LEGACY_fallbackIcon={AddCircleIconOld}
					color={token('color.icon.brand')}
					LEGACY_secondaryColor={token('color.icon.danger')}
				/>
				New icons with legacy fallback (feature flagged) - LEGACY_secondaryColor set to
				color.icon.danger, color set to color.icon.brand
			</Inline>
		</Stack>
	);
};

export default LegacyIconColorExample;
