/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import { Text } from '@atlaskit/primitives/compiled';
import {
	type Placement,
	SpotlightActions,
	SpotlightBody,
	SpotlightCard,
	SpotlightControls,
	SpotlightDismissControl,
	SpotlightFooter,
	SpotlightHeader,
	SpotlightHeadline,
	SpotlightPrimaryAction,
} from '@atlaskit/spotlight';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	root: {
		height: '100vh',
		width: '100vw',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		display: 'grid',
		height: '50vh',
		width: '50vw',
		gridTemplateColumns: '1fr 1fr 1fr',
		gap: token('space.1000'),
	},
	target: {
		width: '100%',
		paddingBlockStart: token('space.200'),
		paddingInlineEnd: token('space.200'),
		paddingBlockEnd: token('space.200'),
		paddingInlineStart: token('space.200'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderColor: token('color.border.bold'),
	},
});

export default (): JSX.Element => {
	return (
		<div css={styles.root}>
			<div css={styles.content}>
				<Spotlight placement="top-start" />

				<Spotlight placement="top-center" />

				<Spotlight placement="top-end" />

				<Spotlight placement="left-start" />

				<div />

				<Spotlight placement="right-start" />

				<Spotlight placement="left-end" />

				<div />

				<Spotlight placement="right-end" />

				<Spotlight placement="bottom-start" />

				<Spotlight placement="bottom-center" />

				<Spotlight placement="bottom-end" />
			</div>
		</div>
	);
};

const Spotlight = ({ placement }: { placement: Placement }) => {
	return (
		<SpotlightCard placement={placement} testId="spotlight">
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
					<SpotlightPrimaryAction>Done</SpotlightPrimaryAction>
				</SpotlightActions>
			</SpotlightFooter>
		</SpotlightCard>
	);
};
