import React from 'react';

import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

/**
 * This HOC serves as a temporary workaround for controlling the style of a parent component.
 * We do not want the Frame to have a hover state when hovering over the action button.
 * TODO: When Firefox begins supporting the :has()pseudo-selector (e.g "frame:has(button:hover){...}"),
 * it should be used instead and the code should be cleaned up.
 */
export default (Button: any, frameRef: React.RefObject<HTMLSpanElement>) => (props: any) => {
	const setBorderStyle = () => {
		const frameNode = frameRef.current;
		if (frameNode) {
			frameNode.style.borderColor = `${token('color.border', N40)}`;
		}
	};

	const removeBorderStyle = () => {
		const frameNode = frameRef.current;
		if (frameNode) {
			frameNode.removeAttribute('style');
		}
	};

	return <Button {...props} onMouseEnter={setBorderStyle} onMouseLeave={removeBorderStyle} />;
};
