import { useEffect, useRef, useState } from 'react';

import { useCreateContainers } from '../use-create-containers';
import { useTeamContainers } from '../use-team-containers';

const PRODUCT_TO_CONTAINER_TYPE = {
	Jira: 'JiraProject',
	Confluence: 'ConfluenceSpace',
	Loom: 'LoomSpace',
} as const;

type CreatedContainersMap<T extends Record<string, any>> = Partial<
	Record<keyof T, { startedAt: number; found: boolean }>
>;

const INTERVAL_TIME = 2000;
const TIMEOUT_DURATION = 30000;

function useRefreshOnContainerCreated(teamId: string) {
	const [containers, { updateContainerLoading }] = useCreateContainers();
	const { refetchTeamContainers, teamContainers } = useTeamContainers(teamId);

	const [createdContainers, setCreatedContainers] = useState<
		CreatedContainersMap<typeof containers>
	>({});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setCreatedContainers({});
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, [teamId]);

	useEffect(() => {
		const products = Object.keys(containers) as Array<keyof typeof containers>;
		products.forEach((product) => {
			const { isCreated } = containers[product];
			if (!isCreated) {
				return;
			}
			const existing = createdContainers[product];
			if (existing && existing.found === false) {
				return;
			}
			if (existing && existing.found) {
				return;
			}
			const containerType = PRODUCT_TO_CONTAINER_TYPE[product];
			if (!containerType) {
				return;
			}
			const currentCount = teamContainers.filter((c) => c.type === containerType).length;
			if (currentCount > 0) {
				setCreatedContainers((prev) => ({
					...prev,
					[product]: { startedAt: Date.now(), found: true },
				}));
				updateContainerLoading(product, false);
				return;
			}
			setCreatedContainers((prev) => ({
				...prev,
				[product]: { startedAt: Date.now(), found: false },
			}));
		});
	}, [containers, createdContainers, teamContainers, updateContainerLoading]);

	useEffect(() => {
		if (Object.keys(createdContainers).length === 0) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}
		if (intervalRef.current) {
			return;
		}
		intervalRef.current = setInterval(() => {
			setCreatedContainers((prev) => {
				let anyPending = false;
				const next: typeof prev = { ...prev };
				(Object.keys(prev) as Array<keyof typeof containers>).forEach((product) => {
					const target = prev[product];
					if (!target || target.found) {
						return;
					}
					const { startedAt } = target;
					const containerType = PRODUCT_TO_CONTAINER_TYPE[product];
					if (!containerType) {
						next[product] = { ...target, found: true };
						updateContainerLoading(product, false);
						return;
					}
					const currentCount = teamContainers.filter(
						(container) => container.type === containerType,
					).length;
					const elapsed = Date.now() - startedAt;
					if (currentCount > 0 || elapsed >= TIMEOUT_DURATION) {
						next[product] = { ...target, found: true };
						updateContainerLoading(product, false);
					} else {
						anyPending = true;
					}
				});
				if (!anyPending) {
					if (intervalRef.current) {
						clearInterval(intervalRef.current);
						intervalRef.current = null;
					}
				}
				if (anyPending) {
					refetchTeamContainers();
				}
				return next;
			});
		}, INTERVAL_TIME);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [createdContainers, teamContainers, refetchTeamContainers, updateContainerLoading]);
}

export { useRefreshOnContainerCreated, INTERVAL_TIME, TIMEOUT_DURATION };
