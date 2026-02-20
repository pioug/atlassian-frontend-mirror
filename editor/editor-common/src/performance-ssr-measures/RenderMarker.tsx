import { useLayoutEffect } from 'react';

interface RenderMarkerProps {
	onRender?: () => void;
}

export function RenderMarker({ onRender }: RenderMarkerProps) {
	useLayoutEffect(() => {
		if (onRender) {
			onRender();
		}
	});

	return null;
}
