import React, { useRef } from 'react';

import { cssMap } from '@atlaskit/css';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

interface CoverImageProps {
	src: string;
	alt?: string;
}

const styles = cssMap({
	container: {
		width: '100%',
		height: '128px',
		overflow: 'hidden',
		position: 'relative',
		borderTopLeftRadius: token('radius.small'),
		borderTopRightRadius: token('radius.small'),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	image: {
		width: '320px',
		height: 'auto',
	},
});

/**
 * This is instead of using background-image in CSS as design-system doesn't support that
 */
export const CoverImage = ({ src, alt = '' }: CoverImageProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	return (
		<Box ref={containerRef} xcss={styles.container} backgroundColor="color.background.neutral">
			<Box as="img" ref={imgRef} src={src} alt={alt} xcss={styles.image} />
		</Box>
	);
};
