/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import ButtonGroup from '@atlaskit/button/button-group';
import { IconButton } from '@atlaskit/button/new';
import AddItemIcon from '@atlaskit/icon/glyph/add-item';
import JiraCaptureIcon from '@atlaskit/icon/glyph/jira/capture';
import AddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';
import { Box, xcss } from '@atlaskit/primitives';
import { B75 } from '@atlaskit/theme/colors';

import Popup from '../src';

const triggerStyles = css({
	backgroundColor: B75,
});
const popupStyles = xcss({
	padding: 'space.050',
});
const HighlightPopup = (props: { children: React.ReactNode }) => (
	<Popup
		isOpen
		placement="bottom"
		content={() => (
			<Box xcss={popupStyles}>
				<ButtonGroup label="Triggerless popup options">
					<IconButton icon={AddCommentIcon} label="Add comment" />
					<IconButton icon={AddItemIcon} label="Add item" />
					<IconButton icon={JiraCaptureIcon} label="Capture in Jira" />
				</ButtonGroup>
			</Box>
		)}
		trigger={(triggerProps) => (
			<span css={triggerStyles} {...triggerProps}>
				{props.children}
			</span>
		)}
	/>
);

export default () => {
	return (
		<main>
			Thanks to soaring electricity costs and the potentially-enormous power drain of cooling
			equipment, <HighlightPopup>few people can happily leave aircon running 24/7</HighlightPopup>.
			This is especially true for those renters who must rely upon portable devices.
		</main>
	);
};
