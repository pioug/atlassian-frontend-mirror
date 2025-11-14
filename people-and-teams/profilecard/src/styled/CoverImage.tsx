import React, { useRef } from 'react';

import { cssMap, cx } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

interface CoverImageProps {
	src: string;
	alt?: string;
	isDisabled?: boolean;
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
	imageNext: {
		height: '100%',
		objectFit: 'cover',
	},
	grayoutImage: {
		filter: 'grayscale(100%)',
	},
});

/**
 * This is instead of using background-image in CSS as design-system doesn't support that
 */
export const CoverImage = ({ src, alt = '', isDisabled }: CoverImageProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const imgRef = useRef<HTMLImageElement | null>(null);

	return (
		<Box ref={containerRef} xcss={styles.container} backgroundColor="color.background.neutral">
			<Box
				as="img"
				ref={imgRef}
				src={src}
				alt={alt}
				xcss={cx(
					fg('cover-header-image-team-profilecard') ? styles.imageNext : styles.image,
					isDisabled && styles.grayoutImage,
				)}
			/>
		</Box>
	);
};
