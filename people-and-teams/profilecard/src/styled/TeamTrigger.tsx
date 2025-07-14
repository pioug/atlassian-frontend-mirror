import React from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { CoverImage } from './CoverImage';

const styles = cssMap({
	cardtriggerwrapper: {
		display: 'inherit',
	},
	cardwrapper: {
		borderRadius: token('border.radius'),
		width: '320px',
		position: 'relative',
	},
	cardheader: {
		height: '128px',
		width: '100%',
	},
	cardcontent: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: token('space.300', '24px'),
		paddingRight: token('space.300', '24px'),
		paddingBottom: token('space.300', '24px'),
		paddingLeft: token('space.300', '24px'),
		minHeight: '104px',
	},
	loadingwrapper: {
		textAlign: 'center',
		marginTop: token('space.500', '40px'),
		marginBottom: token('space.500', '40px'),
	},
});

export const CardTriggerWrapper = () => <Box xcss={cx(styles.cardtriggerwrapper)} />;

export const CardWrapper = ({
	testId,
	children,
}: {
	testId?: string;
	children: React.ReactNode;
}) => (
	<Box xcss={cx(styles.cardwrapper)} backgroundColor="elevation.surface.overlay" testId={testId}>
		{children}
	</Box>
);

export const CardHeader = ({
	image,
	isLoading,
	label,
}: {
	image?: string;
	isLoading?: boolean;
	label?: string;
}) =>
	isLoading || !image ? (
		<Box xcss={cx(styles.cardheader)} backgroundColor="color.background.neutral" />
	) : (
		<CoverImage alt={label || ''} src={image} />
	);

export const CardContent = (props: { children: React.ReactNode }) => (
	<Box xcss={cx(styles.cardcontent)} {...props} />
);

export const LoadingWrapper = (props: { testId?: string; children: React.ReactNode }) => (
	<Box xcss={cx(styles.loadingwrapper)} {...props} />
);
