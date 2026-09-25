/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap as unboundedCssMap } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled/box';

// Asset imports require an explicit extension for TypeScript and ESLint resolution.
// oxlint-disable-next-line import/extensions
import illustrationWithoutProviderIcons from './assets/graphics-with-grid-no-provider-icons-2x.png';

const styles = cssMap({
	illustration: {
		display: 'block',
		height: '600px',
		width: '400px',
	},
	// Keep the artwork out of layout so its extra height cannot stretch the text column.
	illustrationGroup: {
		height: '600px',
		position: 'absolute',
		top: '50%',
		transform: 'translateY(-50%)',
		width: '400px',
	},
	rightPane: {
		borderEndEndRadius: 'inherit',
		borderStartEndRadius: 'inherit',
		flexShrink: 0,
		// Preserve the original minimum; taller text, not the artwork, grows the modal.
		minHeight: '450px',
		overflow: 'hidden',
		position: 'relative',
		width: '400px',
	},
});

// Pixel offsets and rotations are from the Figma illustration, not space tokens.
// Offsets are relative to the illustration's own top-left corner (illustrationGroup), not to
// `rightPane`, so they stay correct however much of `rightPane`'s height is visible.
const illustrationIconStyles = unboundedCssMap({
	footer: {
		height: '15px',
		left: '107px',
		position: 'absolute',
		top: '430px',
		transform: 'rotate(-3.18deg)',
		width: '15px',
	},
	searchFirst: {
		height: '17px',
		left: '123px',
		position: 'absolute',
		top: '259px',
		transform: 'rotate(3.37deg)',
		width: '17px',
	},
	searchSecond: {
		height: '17px',
		left: '121px',
		position: 'absolute',
		top: '290px',
		transform: 'rotate(3.37deg)',
		width: '17px',
	},
	top: {
		height: '40px',
		left: '64px',
		overflow: 'hidden',
		position: 'absolute',
		top: '128px',
		width: '40px',
	},
});

type IllustrationPaneProps = {
	renderProviderIcon: (size: number, testId?: string) => React.ReactNode;
};

const IllustrationPane = ({ renderProviderIcon }: IllustrationPaneProps): JSX.Element => (
	<Box xcss={styles.rightPane}>
		<Box xcss={styles.illustrationGroup}>
			<img
				alt=""
				aria-hidden="true"
				css={styles.illustration}
				data-testid="pre-auth-value-proposition-modal-illustration"
				height={600}
				src={illustrationWithoutProviderIcons}
				srcSet={`${illustrationWithoutProviderIcons} 2x`}
				width={400}
			/>
			<div aria-hidden="true" css={illustrationIconStyles.top}>
				{renderProviderIcon(40, 'pre-auth-value-proposition-modal-illustration-icon')}
			</div>
			<div aria-hidden="true" css={illustrationIconStyles.searchFirst}>
				{renderProviderIcon(17, 'pre-auth-value-proposition-modal-illustration-icon')}
			</div>
			<div aria-hidden="true" css={illustrationIconStyles.searchSecond}>
				{renderProviderIcon(17, 'pre-auth-value-proposition-modal-illustration-icon')}
			</div>
			<div aria-hidden="true" css={illustrationIconStyles.footer}>
				{renderProviderIcon(15, 'pre-auth-value-proposition-modal-illustration-icon')}
			</div>
		</Box>
	</Box>
);

export default IllustrationPane;
