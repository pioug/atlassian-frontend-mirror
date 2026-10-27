import React, { useRef, useState } from 'react';

import Button from '@atlaskit/button/default/button';
import { Inline } from '@atlaskit/primitives/compiled/inline';
import { Stack } from '@atlaskit/primitives/compiled/stack';
import { Text } from '@atlaskit/primitives/compiled/text';

import { BenchmarkLayout, BenchmarkSurface } from './shared';

/**
 * Benchmark prompt:
 * Add coordinated motion when notifications are inserted and dismissed. New notifications should
 * enter in sequence, and dismissed notifications should finish leaving before removal.
 */
export default function NotificationListBenchmark(): JSX.Element {
	const nextId = useRef(3);
	const [notifications, setNotifications] = useState([
		{ id: 1, message: 'Roadmap updated' },
		{ id: 2, message: 'Review requested' },
	]);

	const addNotifications = (): void => {
		const firstId = nextId.current;
		nextId.current += 2;
		setNotifications((items) => [
			...items,
			{ id: firstId, message: `Notification ${firstId}` },
			{ id: firstId + 1, message: `Notification ${firstId + 1}` },
		]);
	};

	return (
		<BenchmarkLayout
			title="Notifications"
			description="Add notifications in batches or dismiss one."
		>
			<Stack space="space.150">
				<Button onClick={addNotifications}>Add two notifications</Button>
				<Stack space="space.100">
					{notifications.map((notification) => (
						<BenchmarkSurface key={notification.id}>
							<Inline alignBlock="center" spread="space-between">
								<Text>{notification.message}</Text>
								<Button
									onClick={() =>
										setNotifications((items) => items.filter(({ id }) => id !== notification.id))
									}
								>
									Dismiss
								</Button>
							</Inline>
						</BenchmarkSurface>
					))}
				</Stack>
			</Stack>
		</BenchmarkLayout>
	);
}
