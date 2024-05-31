import React, { useMemo, useEffect } from 'react';
import type WebBridgeImpl from '../../../src/editor/native-to-web';

interface Props {
	bridge: WebBridgeImpl;
}

const Options = ({ bridge }: Props) => {
	const toggleDarkMode = (on: boolean) => {
		const currentParams = new URLSearchParams(window.location.search);
		if (on) {
			currentParams.set('enableLightDarkTheming', 'true');
		} else {
			currentParams.delete('enableLightDarkTheming');
		}

		window.location.search = currentParams.toString();
	};

	const darkModeEnabled = useMemo(
		() => Boolean(new URLSearchParams(window.location.search).get('enableLightDarkTheming')),
		[],
	);

	useEffect(() => {
		if (darkModeEnabled) {
			bridge.configure(JSON.stringify({ mode: 'dark' }));
		} else {
			bridge.configure(JSON.stringify({ mode: 'light' }));
		}
	}, [darkModeEnabled, bridge]);

	return (
		<div>
			<div>
				<input
					type="checkbox"
					checked={darkModeEnabled}
					onChange={(event) => toggleDarkMode(event.target.checked)}
				/>
				<label>Dark Mode (You also need to emulate dark mode in rendering tab in debugger)</label>
			</div>
		</div>
	);
};

export default Options;
