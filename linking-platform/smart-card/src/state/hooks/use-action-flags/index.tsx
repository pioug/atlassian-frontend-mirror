import React, { useCallback, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { type CreateFlagArgs } from '@atlaskit/flag';
import type { LinkProvider } from '@atlaskit/link-extractors';

import { messages } from '../../../messages';
import ImageIcon from '../../../view/common/image-icon';
import { showFlag } from '../../../view/Flag';

const FLAG_ICON_SIZE = '16px';

const renderIcon = (iconUrlOrElement?: string | React.ReactNode): React.ReactNode | undefined => {
	if (!iconUrlOrElement) {
		return;
	}

	const icon =
		iconUrlOrElement && typeof iconUrlOrElement === 'string' ? (
			<ImageIcon
				height={FLAG_ICON_SIZE}
				testId="sl-flag"
				url={iconUrlOrElement}
				width={FLAG_ICON_SIZE}
			/>
		) : (
			iconUrlOrElement
		);

	return icon;
};

// Safe wrapper — returns null if IntlProvider is not in the tree
const useIntlSafe = (): ReturnType<typeof useIntl> | null => {
	try {
		return useIntl();
	} catch {
		return null;
	}
};

type ShowConnectFlagsArgs = Partial<CreateFlagArgs> & { provider?: LinkProvider };
type UseActionFlagsReturnType = { showConnectFlag: (args?: ShowConnectFlagsArgs) => void };
const useActionFlags = (): UseActionFlagsReturnType => {
	const intl = useIntlSafe();

	const showConnectFlag = useCallback(
		({ provider, ...flagArgs }: ShowConnectFlagsArgs = {}): void => {
			if (!intl) {
				return;
			}

			const context =
				provider?.text ??
				intl.formatMessage(messages.connect_link_account_success_flag_title_default);

			showFlag({
				icon: renderIcon(provider?.icon),
				title: intl.formatMessage(messages.connect_link_account_success_flag_title, { context }),
				description: intl.formatMessage(messages.connect_link_account_success_flag_description),
				...flagArgs,
			});
		},
		[intl],
	);

	return useMemo(() => ({ showConnectFlag }), [showConnectFlag]);
};

export default useActionFlags;
