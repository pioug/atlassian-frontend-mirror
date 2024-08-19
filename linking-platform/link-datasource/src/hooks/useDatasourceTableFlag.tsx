import React, { useCallback, useMemo } from 'react';

import { FormattedMessage } from 'react-intl-next';
import uuid from 'uuid';

import { type CreateFlagArgs, useFlags } from '@atlaskit/flag';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { token } from '@atlaskit/tokens';

import { issueLikeTableMessages } from '../ui/issue-like-table/messages';

interface DatasourceTableFlagOptions {
	url?: string;
}

export const useDatasourceTableFlag = (options?: DatasourceTableFlagOptions) => {
	const { showFlag } = useFlags();

	const actions = useMemo(() => {
		const resourceLink = options?.url && {
			content: <FormattedMessage {...issueLikeTableMessages.goToResourceLink} />,
			href: options?.url,
			target: '_blank',
		};

		return resourceLink ? [resourceLink] : undefined;
	}, [options?.url]);

	const showErrorFlag = useCallback(
		(args?: Partial<CreateFlagArgs>) => {
			showFlag({
				actions,
				description: <FormattedMessage {...issueLikeTableMessages.updateErrorGenericDescription} />,
				// We need IconTile (currently in beta) in order to scale the new icon to 24px
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
				icon: <CrossCircleIcon label="Error" primaryColor={token('color.icon.danger')} />,
				id: uuid(),
				isAutoDismiss: true,
				title: <FormattedMessage {...issueLikeTableMessages.updateErrorGenericTitle} />,
				...args,
			});
		},
		[actions, showFlag],
	);

	return { showErrorFlag };
};
