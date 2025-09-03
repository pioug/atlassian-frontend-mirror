/**
 * This is a scheduled batched register mechanism for resolving blue hyperlinks while the page is idle.
 * i.e. SharePoint tenants with the same hostname will be grouped together before the register is made.
 */

import { useCallback, useRef } from 'react';

interface BatchItem {
	href: string;
	register: () => Promise<any>;
	reject: (error: any) => void;
	resolve: (value: any) => void;
}

const batchQueue = new Map<string, BatchItem[]>();
const batchTimeouts = new Map<string, NodeJS.Timeout>();
const BATCH_DELAY = 250;

const executeBatch = (hostname: string): void => {
	const items = batchQueue.get(hostname) || [];
	if (items.length === 0) {
		return;
	}

	batchQueue.delete(hostname);
	batchTimeouts.delete(hostname);

	items.forEach(({ register, resolve, reject }) => {
		register().then(resolve).catch(reject);
	});
};

const addToBatch = (hostname: string, item: BatchItem): void => {
	if (!batchQueue.has(hostname)) {
		batchQueue.set(hostname, []);
	}

	batchQueue.get(hostname)!.push(item);
	if (batchTimeouts.has(hostname)) {
		clearTimeout(batchTimeouts.get(hostname)!);
	}

	batchTimeouts.set(
		hostname,
		setTimeout(() => {
			executeBatch(hostname);
		}, BATCH_DELAY),
	);
};

export const useScheduledRegister = (href: string, register: (() => Promise<any>) | null) => {
	const isScheduled = useRef(false);

	const scheduledRegister = useCallback((): Promise<void> => {
		if (!href || !register || isScheduled.current) {
			return Promise.resolve();
		}

		isScheduled.current = true;

		return new Promise((resolve, reject) => {
			const scheduleRegister = () => {
				try {
					const hostname = new URL(href).hostname;

					addToBatch(hostname, {
						href,
						register,
						resolve: (value) => {
							isScheduled.current = false;
							resolve(value);
						},
						reject: (error) => {
							isScheduled.current = false;
							reject(error);
						},
					});
				} catch (error) {
					isScheduled.current = false;
					register().then(resolve).catch(reject);
				}
			};

			if (typeof window !== 'undefined') {
				if ('requestIdleCallback' in window) {
					window.requestIdleCallback(scheduleRegister);
				} else {
					setTimeout(scheduleRegister, 0);
				}
			} else {
				scheduleRegister();
			}
		});
	}, [href, register]);

	return scheduledRegister;
};
