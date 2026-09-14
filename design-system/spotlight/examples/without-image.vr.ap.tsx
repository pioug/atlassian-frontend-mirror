/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import { SpotlightActions } from '@atlaskit/spotlight/actions';
import { SpotlightBody } from '@atlaskit/spotlight/body';
import { SpotlightCard } from '@atlaskit/spotlight/card';
import { SpotlightControls } from '@atlaskit/spotlight/controls';
import { SpotlightDismissControl } from '@atlaskit/spotlight/dismiss-control';
import { SpotlightFooter } from '@atlaskit/spotlight/footer';
import { SpotlightHeader } from '@atlaskit/spotlight/header';
import { SpotlightHeadline } from '@atlaskit/spotlight/headline';
import { SpotlightPrimaryAction } from '@atlaskit/spotlight/primary-action';
import { SpotlightSecondaryAction } from '@atlaskit/spotlight/secondary-action';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		paddingBlockStart: token('space.400'),
		paddingInlineEnd: token('space.400'),
		paddingBlockEnd: token('space.400'),
		paddingInlineStart: token('space.400'),
		minHeight: '400px',
	},
});

export default function Basic(): JSX.Element {
	return (
		<div css={styles.root}>
			<SpotlightCard testId="spotlight">
				<SpotlightHeader>
					<SpotlightHeadline>Headline</SpotlightHeadline>
					<SpotlightControls>
						<SpotlightDismissControl />
					</SpotlightControls>
				</SpotlightHeader>
				<SpotlightBody>
					<Text>Brief and direct textual content to elaborate on the intent.</Text>
				</SpotlightBody>
				<SpotlightFooter>
					<SpotlightActions>
						<SpotlightSecondaryAction>Back</SpotlightSecondaryAction>
						<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
					</SpotlightActions>
				</SpotlightFooter>
			</SpotlightCard>
		</div>
	);
}
