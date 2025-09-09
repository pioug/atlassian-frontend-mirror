import React from 'react';
import SVG from '@atlaskit/icon/svg';

export default () => {
	return (
		<span data-vc={'icon-editor-dropbox'} aria-hidden={true}>
			{/* This colour is not ADG - it is the dropbox brand color */}
			{/* eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/design-system/ensure-design-token-usage/preview, @atlaskit/design-system/no-custom-icons*/}
			<SVG primaryColor="#0061FF" label="dropbox-icon">
				<path
					fill="currentcolor"
					fill-rule="evenodd"
					d="M7 3 2 6.202l5 3.202-5 3.202 5 3.202 5-3.202 5 3.202 5-3.202-5-3.202 5-3.202L17 3l-5 3.202zm5 3.202 5 3.202-5 3.202-5-3.202zm0 13.875-5-3.202 5-3.202 5 3.202z"
					clip-rule="evenodd"
				/>
			</SVG>
		</span>
	);
};
