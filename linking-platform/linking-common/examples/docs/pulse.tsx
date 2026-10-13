import React, { useEffect, useState } from 'react';

import Link from '@atlaskit/link/link';
import { Pulse } from '@atlaskit/linking-common/pulse/pulse';

export default function NewlyCreatedLinkExample(): React.JSX.Element {
	const [showPulse, setShowPulse] = useState(false);

	useEffect(() => {
		const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const updateMotionPreference = () => setShowPulse(!motionPreference.matches);

		updateMotionPreference();
		motionPreference.addEventListener('change', updateMotionPreference);

		return () => motionPreference.removeEventListener('change', updateMotionPreference);
	}, []);

	return (
		<p>
			<Pulse key={showPulse ? 'motion-enabled' : 'reduced-motion'} showPulse={showPulse} isInline>
				<Link href="https://example.atlassian.net/browse/PLAT-42">New project link</Link>
			</Pulse>
		</p>
	);
}
