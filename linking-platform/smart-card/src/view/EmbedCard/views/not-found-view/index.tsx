import React, { useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';

import { messages } from '../../../../messages';
import { toMessage } from '../../../../utils/intl-utils';
import UnresolvedView from '../unresolved-view';

import { NotFoundSVG } from './not-found-svg';
import type { NotFoundViewProps } from './types';

const NotFoundView = ({
	context,
	accessContext,
	testId = 'embed-card-not-found-view',
	...unresolvedViewProps
}: NotFoundViewProps) => {
	const { icon, image, text = '' } = context ?? {};
	const { titleMessageKey, descriptiveMessageKey } = accessContext ?? {};
	const values = useMemo(() => ({ product: text }), [text]);

	return (
		<UnresolvedView
			{...unresolvedViewProps}
			icon={icon}
			image={image ?? <NotFoundSVG />}
			testId={testId}
			text={text}
			title={
				<FormattedMessage
					{...toMessage(messages.not_found_title, titleMessageKey)}
					values={values}
				/>
			}
			description={
				<FormattedMessage
					{...toMessage(messages.not_found_description, descriptiveMessageKey)}
					values={values}
				/>
			}
		/>
	);
};

export default NotFoundView;
