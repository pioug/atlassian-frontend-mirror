import React, { useCallback, useState } from 'react';

import Button from '@atlaskit/button/new';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { AiSuggestionsPlugin } from '../aiSuggestionsPluginType';

import { StagingArea } from './StagingArea';

export const SuggestionsToolbarButton = ({
	api,
}: {
	api?: ExtractInjectionAPI<AiSuggestionsPlugin>;
}): React.JSX.Element => {
	const [isModalOpen, setIsModalOpen] = useState(true);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	return (
		<>
			{/* eslint-disable-next-line @atlassian/i18n/no-literal-string-in-jsx */}
			<Button appearance="subtle" onClick={handleOpenModal}>
				Suggestions
			</Button>
			{isModalOpen && <StagingArea api={api} onClose={handleCloseModal} />}
		</>
	);
};
