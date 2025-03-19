/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@compiled/react';

import Flag from '@atlaskit/flag';
import InformationIcon from '@atlaskit/icon/core/information';

const styles = cssMap({
	root: {
		// Setting the default font to something extravagent to ensure the Flag overrides it.
		font: `italic 1.2rem "Fira Sans"`,
	},
});

export default function ExplicitFontStyles() {
	return (
		<div css={styles.root}>
			<Flag
				actions={[{ content: 'Understood' }, { content: 'No Way!' }]}
				title="Welcome to the jungle"
				description="We got fun and games. We got everything you want honey, we know the names."
				icon={<InformationIcon label="" />}
				id="flag-1"
			/>
		</div>
	);
}
