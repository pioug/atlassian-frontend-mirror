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
		borderRadius: token('radius.small'),
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
	grayoutImage: {
		filter: 'grayscale(100%)',
	},
});

export const CardTriggerWrapper = (): React.JSX.Element => (
	<Box xcss={cx(styles.cardtriggerwrapper)} />
);

export const CardWrapper = ({
	testId,
	children,
}: {
	testId?: string;
	children: React.ReactNode;
}): React.JSX.Element => (
	<Box xcss={cx(styles.cardwrapper)} backgroundColor="elevation.surface.overlay" testId={testId}>
		{children}
	</Box>
);

export const CardHeader = ({
	image,
	isLoading,
	label,
	isDisabled,
}: {
	image?: string;
	isLoading?: boolean;
	label?: string;
	isDisabled?: boolean;
}): React.JSX.Element =>
	isLoading || !image ? (
		<Box
			xcss={cx(styles.cardheader, isDisabled && styles.grayoutImage)}
			backgroundColor="color.background.neutral"
		/>
	) : (
		<CoverImage alt={label || ''} src={image} isDisabled={isDisabled} />
	);

export const CardContent = (props: { children: React.ReactNode }): React.JSX.Element => (
	<Box xcss={cx(styles.cardcontent)} {...props} />
);

export const LoadingWrapper = (props: {
	testId?: string;
	children: React.ReactNode;
}): React.JSX.Element => <Box xcss={cx(styles.loadingwrapper)} {...props} />;
