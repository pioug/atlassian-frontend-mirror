/** @jsx jsx */
import { forwardRef, memo } from 'react';

import { jsx } from '@emotion/react';

import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import { type SimpleTagProps } from '../shared/types';

const SimpleTag = forwardRef(
	(
		{
			appearance,
			elemBefore = null,
			color = 'standard',
			href,
			testId,
			text = '',
			linkComponent,
		}: SimpleTagProps,
		ref: React.Ref<any>,
	) => {
		const content = (
			<Content
				elemBefore={elemBefore}
				isRemovable={false}
				text={text}
				color={color}
				href={href}
				linkComponent={linkComponent}
			/>
		);

		return (
			<BaseTag
				ref={ref}
				testId={testId}
				href={href}
				appearance={appearance}
				color={color}
				before={<Before elemBefore={elemBefore} />}
				contentElement={content}
			/>
		);
	},
);

export default memo(SimpleTag);
