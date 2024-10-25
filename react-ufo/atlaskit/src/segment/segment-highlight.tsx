import React, { useEffect, useState } from 'react';

type Props = {
	segmentName: string;
};

export function SegmentHighlight({ segmentName }: Props) {
	const [segmentHighlight, setSegmentHighlight] = useState<boolean>(false);

	useEffect(() => {
		try {
			const shouldHighlightSegments = sessionStorage.getItem('segmentsHighlight') === 'true';
			setSegmentHighlight(shouldHighlightSegments);
		} catch (err) {
			/* do nothing */
		}
	}, []);

	if (segmentHighlight) {
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
			<span data-segment-name={segmentName} style={{ display: 'none' }}></span>
		);
	}

	return null;
}
