/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import MediaServicesAddCommentIcon from '@atlaskit/icon/core/comment-add';
import Popup from '@atlaskit/popup';

const popupStyles = css({
	width: 175,
	height: 250,
});
export default (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Popup
			shouldRenderToParent
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
