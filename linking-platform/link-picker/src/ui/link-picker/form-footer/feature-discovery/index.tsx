/** @jsx jsx */
import { type FC, useEffect, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';

import { pulseStyles } from './styled';

type FeatureDiscoveryProps = {
	children: React.ReactElement;
	testId?: string;
};

const LOCAL_STORAGE_CLIENT_KEY = '@atlaskit/link-picker';
const LOCAL_STORAGE_DISCOVERY_KEY = 'action-discovery-jira-create';
const LOCAL_STORAGE_DISCOVERY_VALUE = 'discovered';
const LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS = 15552000000; // 180 days

/**
 * This is a hacky solution to help with the feature discovery.
 * This implementation must be removed once the experiment is completed.
 *
 * Cleanup ticket:
 * https://product-fabric.atlassian.net/browse/EDM-7480
 */
const FeatureDiscovery: FC<FeatureDiscoveryProps> = ({ children, testId }) => {
	const storageClient = useMemo(() => new StorageClient(LOCAL_STORAGE_CLIENT_KEY), []);
	// Set this to `false` if you want to always show the feature discovery pulse.
	// (or open Application tab in your devtools and delete the relevent row)
	const discovered = useMemo(
		() => storageClient.getItem(LOCAL_STORAGE_DISCOVERY_KEY) === LOCAL_STORAGE_DISCOVERY_VALUE,
		[storageClient],
	);

	useEffect(() => {
		return () => {
			if (!discovered) {
				storageClient.setItemWithExpiry(
					LOCAL_STORAGE_DISCOVERY_KEY,
					LOCAL_STORAGE_DISCOVERY_VALUE,
					LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS,
				);
			}
		};
	}, [storageClient, discovered]);

	if (discovered) {
		return children;
	}

	return (
		// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		<span css={pulseStyles} data-testid={`${testId}-discovery`}>
			{children}
		</span>
	);
};

export default FeatureDiscovery;
