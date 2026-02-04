/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useState } from 'react';

import { css, jsx } from '@compiled/react';

import { IconButton } from '@atlaskit/button/new';
import MediaServicesAddCommentIcon from '@atlaskit/icon/core/comment-add';
import Popup from '@atlaskit/popup';
import Select from '@atlaskit/select';

const selectContainerStyles = css({
	minWidth: 175,
	minHeight: 250,
});

export default (): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<Fragment>
			Popup with select
			<br />
			<Popup
				shouldRenderToParent
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				placement="bottom-start"
				content={() => (
					<div css={selectContainerStyles}>
						<Select
							defaultValue={{ label: 'Brisbane', value: 'brisbane' }}
							options={[
								{ label: 'Adelaide', value: 'adelaide', extra: 'extra' },
								{ label: 'Brisbane', value: 'brisbane' },
								{ label: 'Canberra', value: 'canberra' },
								{ label: 'Darwin', value: 'darwin' },
								{ label: 'Hobart', value: 'hobart' },
								{ label: 'Melbourne', value: 'melbourne' },
								{ label: 'Perth', value: 'perth' },
								{ label: 'Sydney', value: 'sydney' },
							]}
							isMulti
							isSearchable={false}
							placeholder="Choose a City"
						/>
					</div>
				)}
				trigger={(triggerProps) => (
					<IconButton
						{...triggerProps}
						isSelected={isOpen}
						onClick={() => setIsOpen(!isOpen)}
						value="Add"
						icon={MediaServicesAddCommentIcon}
						label="Add"
					/>
				)}
			/>
		</Fragment>
	);
};
