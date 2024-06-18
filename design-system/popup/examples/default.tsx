/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { IconButton } from '@atlaskit/button/new';
import MediaServicesAddCommentIcon from '@atlaskit/icon/glyph/media-services/add-comment';

import Popup from '../src';

const popupStyles = css({
	width: 175,
	height: 250,
});
export default () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			placement="bottom-start"
			content={() => <div css={popupStyles} />}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					icon={MediaServicesAddCommentIcon}
					label="Add"
				/>
			)}
		/>
	);
};
