import React, { type ReactNode } from 'react';

import { di } from 'react-magnetic-di';

import { useEditorViewHasInfos } from '../../../../hooks/use-editor-view-has-infos';
import { useExternalMessages } from '../../../../state';
import { FormatMessages } from '../format/FormatMessages';

export const useFormattedInfoMessage = (): ReactNode => {
	di(useExternalMessages, useEditorViewHasInfos);

	const [{ infos: externalInfos }] = useExternalMessages();
	const hasInfos = useEditorViewHasInfos();

	if (!hasInfos) {
		return null;
	}

	return <FormatMessages messages={externalInfos} />;
};
