/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useRef } from 'react';

import { css, jsx, keyframes } from '@compiled/react';

import { StorageClient } from '@atlaskit/frontend-utilities/storage-client';
import { token } from '@atlaskit/tokens';

const LOCAL_STORAGE_CLIENT_KEY = '@atlaskit/smart-card';
const LOCAL_STORAGE_DISCOVERY_KEY = 'action-discovery-ai-summarise';
const LOCAL_STORAGE_DISCOVERY_VALUE = 'discovered';
const LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS = 15552000000; // 180 days
const LOCAL_STORAGE_DISCOVERY_REQUIRED_TIME = 2000;

export type FeatureDiscoveryProps = {
	children: React.ReactElement;
	testId?: string;
};

const pulseKeyframes = keyframes({
	to: {
		boxShadow: '0 0 0 7px rgba(0, 0, 0, 0)',
	},
});

const pulseStyles = css({
	display: 'inline-flex',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
	boxShadow: `0 0 0 0 ${token('color.border.discovery', '#8270DB')}`,
	animationName: pulseKeyframes,
	animationDuration: '2s',
	animationTimingFunction: 'cubic-bezier(0.5, 0, 0, 1)',
	animationDelay: '0.25s',
	animationFillMode: 'both',
	animationIterationCount: 2,
});

/**
 * This is a hacky solution to help with the feature discovery.
 * This implementation must be removed once the experiment is completed.
 * Cleanup on https://product-fabric.atlassian.net/browse/EDM-9649
 */
const FeatureDiscovery = ({ children, testId }: FeatureDiscoveryProps): JSX.Element => {
	const renderedTime = useRef<number>();

	const storageClient = useMemo(() => new StorageClient(LOCAL_STORAGE_CLIENT_KEY), []);

	const discovered = useMemo(() => {
		try {
			return storageClient.getItem(LOCAL_STORAGE_DISCOVERY_KEY) === LOCAL_STORAGE_DISCOVERY_VALUE;
		} catch {
			// If localStorage is not available, don't show feature discovery component. Treat it as 'discovered'.
			return true;
		}
	}, [storageClient]);

	useEffect(() => {
		renderedTime.current = Date.now();

		return () => {
			if (!discovered && renderedTime.current) {
				const duration = Date.now() - renderedTime.current;
				if (duration > LOCAL_STORAGE_DISCOVERY_REQUIRED_TIME) {
					try {
						storageClient.setItemWithExpiry(
							LOCAL_STORAGE_DISCOVERY_KEY,
							LOCAL_STORAGE_DISCOVERY_VALUE,
							LOCAL_STORAGE_DISCOVERY_EXPIRY_IN_MS,
						);
					} catch {
						// silent error
					}
				}
			}
		};
	}, [storageClient, discovered]);

	const component = useMemo(() => {
		if (!discovered) {
			return (
				<span css={pulseStyles} data-testid={`${testId}-discovery`}>
					{children}
				</span>
			);
		}
	}, [children, discovered, testId]);

	return component ?? children;
};

export default FeatureDiscovery;
