import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ContentRef } from '@atlaskit/task-decision';
import { DecisionItem } from '@atlaskit/task-decision';

interface Props {
	contentRef: ContentRef;
	showPlaceholder?: boolean;
}

export const Decision = ({
	contentRef,
	showPlaceholder,
	intl: { formatMessage },
}: Props & WrappedComponentProps) => {
	const placeholder = formatMessage(tasksAndDecisionsMessages.decisionPlaceholder);

	return (
		<DecisionItem
			contentRef={contentRef}
			placeholder={placeholder}
			showPlaceholder={showPlaceholder}
		/>
	);
};

Decision.displayName = 'Decision';

export default injectIntl(Decision);
