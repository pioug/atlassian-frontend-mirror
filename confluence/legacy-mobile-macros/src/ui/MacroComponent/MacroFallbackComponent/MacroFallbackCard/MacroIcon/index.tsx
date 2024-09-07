import React from 'react';

import AkOverviewIcon from '@atlaskit/icon/core/migration/align-left--overview';
import AkEditorAddonIcon from '@atlaskit/icon/glyph/editor/addon';
import { JiraIcon as AkJiraIcon } from '@atlaskit/logo';

import { LineChartIcon } from '../../../../../common/ui';

export const macroIcon = (iconUrl: string, extensionKey: string, title: string) => {
	switch (extensionKey) {
		case 'toc':
			return <AkOverviewIcon color="currentColor" label={title} LEGACY_size="small" />;

		case 'jira':
			return <AkJiraIcon label={title} size="small" />;

		case 'chart:default':
			return <LineChartIcon />;
	}

	if (!iconUrl) {
		// TODO: https://product-fabric.atlassian.net/browse/DSP-20770
		// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
		return <AkEditorAddonIcon label={title} size="medium" />;
	}

	// connect macros will have absolute urls while others
	// will have relative
	// const src = getContextAwareFullPath(iconUrl, true); // figure out if the package is actually used
	const src = iconUrl;
	return <img src={src} width="16" height="16" alt={title} />; // test this, idk how but do it
};
