import React, { useEffect, useState } from 'react';

import type { OneClickChatSpotlight } from './index';

type SpotlightComponent = typeof OneClickChatSpotlight;

/** Keep the existing action usable during SSR, loading and chunk failures. */
export function OneClickChatSpotlightLoader(
	props: React.ComponentProps<SpotlightComponent>,
): React.JSX.Element {
	const [Spotlight, setSpotlight] = useState<SpotlightComponent>();

	useEffect(() => {
		let active = true;
		import(
			/* webpackChunkName: "@atlaskit-internal_smartcard-one-click-chat-spotlight" */ './index'
		)
			.then(({ OneClickChatSpotlight }) => {
				if (active) {
					setSpotlight(() => OneClickChatSpotlight);
				}
			})
			.catch(() => {
				// An optional spotlight must not break the existing inline action.
			});
		return () => {
			active = false;
		};
	}, []);

	return Spotlight ? <Spotlight {...props} /> : <>{props.children}</>;
}
