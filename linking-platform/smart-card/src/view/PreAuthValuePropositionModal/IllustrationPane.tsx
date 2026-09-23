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
		height: '450px',
		width: '400px',
	},
	illustrationLayer: {
		borderEndEndRadius: 'inherit',
		borderStartEndRadius: 'inherit',
		height: '450px',
		overflow: 'hidden',
		position: 'relative',
		width: '400px',
	},
	rightPane: {
		alignItems: 'center',
		borderEndEndRadius: 'inherit',
		borderStartEndRadius: 'inherit',
		display: 'flex',
		flexShrink: 0,
		height: '100%',
		justifyContent: 'center',
		overflow: 'hidden',
		width: '400px',
	},
});

// Pixel offsets and rotations are from the Figma illustration, not space tokens.
const illustrationIconStyles = unboundedCssMap({
	footer: {
		height: '15px',
		left: '107px',
		position: 'absolute',
		top: '355px',
		transform: 'rotate(-3.18deg)',
		width: '15px',
	},
	searchFirst: {
		height: '17px',
		left: '123px',
		position: 'absolute',
		top: '184px',
		transform: 'rotate(3.37deg)',
		width: '17px',
	},
	searchSecond: {
		height: '17px',
		left: '121px',
		position: 'absolute',
		top: '215px',
		transform: 'rotate(3.37deg)',
		width: '17px',
	},
	top: {
		height: '40px',
		left: '64px',
		overflow: 'hidden',
		position: 'absolute',
		top: '53px',
		width: '40px',
	},
});

type IllustrationPaneProps = {
	renderProviderIcon: (size: number, testId?: string) => React.ReactNode;
};

const IllustrationPane = ({ renderProviderIcon }: IllustrationPaneProps): JSX.Element => (
	<Box xcss={styles.rightPane}>
		<Box xcss={styles.illustrationLayer}>
			<img
				alt=""
				aria-hidden="true"
				css={styles.illustration}
				data-testid="pre-auth-value-proposition-modal-illustration"
				height={450}
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
