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

export const INTERVAL_TIME = 2000;
export const TIMEOUT_DURATION = 30000;

export const useRefreshOnContainerCreated = (teamId: string): void => {
	const [containers, { updateContainerLoading, updateContainerCreated }] = useCreateContainers();
	const { refetchTeamContainers, teamContainers } = useTeamContainers(teamId);

	const [createdContainers, setCreatedContainers] = useState<
		CreatedContainersMap<typeof containers>
	>({});

	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const clearIntervalRef = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	};

	useEffect(() => {
		setCreatedContainers({});
		clearIntervalRef();
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
				updateContainerCreated(product, false);
				return;
			}
			setCreatedContainers((prev) => ({
				...prev,
				[product]: { startedAt: Date.now(), found: false },
			}));
		});
	}, [
		containers,
		createdContainers,
		teamContainers,
		updateContainerLoading,
		updateContainerCreated,
	]);

	useEffect(() => {
		const hasPending = Object.values(createdContainers).some(
			(entry) => entry && entry.found === false,
		);

		if (!hasPending) {
			clearIntervalRef();
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
						updateContainerCreated(product, false);
						return;
					}
					const currentCount = teamContainers.filter(
						(container) => container.type === containerType,
					).length;
					const elapsed = Date.now() - startedAt;
					if (currentCount > 0 || elapsed >= TIMEOUT_DURATION) {
						next[product] = { ...target, found: true };
						updateContainerLoading(product, false);
						updateContainerCreated(product, false);
					} else {
						anyPending = true;
					}
				});
				if (!anyPending) {
					clearIntervalRef();
					return next;
				}
				refetchTeamContainers();
				return next;
			});
		}, INTERVAL_TIME);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [
		createdContainers,
		teamContainers,
		refetchTeamContainers,
		updateContainerLoading,
		updateContainerCreated,
	]);
};
