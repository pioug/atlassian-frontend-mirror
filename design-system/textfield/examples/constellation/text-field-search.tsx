/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cssMap, jsx } from '@atlaskit/css';
import SearchIcon from '@atlaskit/icon/core/search';
import { Box } from '@atlaskit/primitives/compiled/box';
import Textfield from '@atlaskit/textfield/text-field';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	icon: {
		paddingInlineStart: token('space.075'),
	},
});

export default function TextFieldSearch(): JSX.Element {
	return (
		<Textfield
			type="search"
			aria-label="Search goals"
			elemBeforeInput={
				<Box xcss={styles.icon}>
					<SearchIcon label="" />
				</Box>
			}
		/>
	);
}
