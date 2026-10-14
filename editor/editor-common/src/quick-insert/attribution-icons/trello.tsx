import React from 'react';

import { trelloIcon } from '@atlaskit/logo/raw-icons';

/** Decorative product icon accompanying the localized Trello attribution name. */
export const TrelloAttributionIcon = (): React.JSX.Element => (
	<img src={trelloIcon} alt="" width={16} height={16} />
);
