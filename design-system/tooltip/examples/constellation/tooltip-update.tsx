import React, { type ReactNode, useEffect, useLayoutEffect, useState } from 'react';

import Button from '@atlaskit/button/new';
import { Inline } from '@atlaskit/primitives/compiled';
import Tooltip from '@atlaskit/tooltip';

function TooltipContent({ update }: { update?: () => void }): ReactNode {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, []);

	useLayoutEffect(() => {
		update?.();
	}, [isLoading, update]);

	return isLoading ? 'Loading...' : 'I am a lazy loaded tooltip, with a lot of content';
}

export default function TooltipUpdateContentExample() {
	return (
		<Inline space="space.100">
			<Tooltip content={({ update }) => <TooltipContent update={update} />}>
				{(tooltipProps) => <Button {...tooltipProps}>Using the update callback</Button>}
			</Tooltip>

			<Tooltip content={() => <TooltipContent />}>
				{(tooltipProps) => <Button {...tooltipProps}>Not using the update callback</Button>}
			</Tooltip>
		</Inline>
	);
}
