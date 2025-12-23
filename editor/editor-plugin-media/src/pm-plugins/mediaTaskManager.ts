import type { MediaState } from '../types';

type MediaTask = {
	cancelController: AbortController;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	task: Promise<any>;
};

export class MediaTaskManager {
	private pendingTask = Promise.resolve<MediaState | null>(null);
	private taskMap = new Map<string, MediaTask>();

	cancelPendingTask = (id: string): void => {
		const task = this.taskMap.get(id);
		if (task && !task.cancelController.signal.aborted) {
			task.cancelController.abort();
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line require-await
	waitForPendingTasks = async (
		timeout?: number,
		lastTask?: Promise<MediaState | null>,
	): Promise<MediaState | null> => {
		if (lastTask && this.pendingTask === lastTask) {
			return lastTask;
		}

		const chainedPromise: Promise<MediaState | null> = this.pendingTask.then(() =>
			// Call ourselves to make sure that no new pending tasks have been
			// added before the current promise has resolved.
			this.waitForPendingTasks(undefined, this.pendingTask),
		);

		if (!timeout) {
			return chainedPromise;
		}

		let rejectTimeout: number;
		const timeoutPromise = new Promise<null>((_resolve, reject) => {
			rejectTimeout = window.setTimeout(
				() => reject(new Error(`Media operations did not finish in ${timeout} ms`)),
				timeout,
			);
		});

		return Promise.race([
			timeoutPromise,
			chainedPromise.then((value) => {
				clearTimeout(rejectTimeout);
				return value;
			}),
		]);
	};

	resumePendingTask = (id: string): void => {
		const mediaTask = this.taskMap.get(id);
		if (mediaTask && mediaTask.cancelController.signal.aborted) {
			this.addPendingTask(mediaTask.task, id);
		}
	};

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addPendingTask = (task: Promise<any>, id?: string) => {
		let currentTask = task;

		if (id) {
			const cancelController = new AbortController();
			const signal = cancelController.signal;

			this.taskMap.set(id, {
				task,
				cancelController,
			});

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			currentTask = new Promise<any>((resolve) => {
				task.then(resolve, resolve).finally(() => {
					this.taskMap.delete(id);
				});

				signal.onabort = () => {
					resolve(null);
				};
			});
		}

		// Chain the previous promise with a new one for this media item
		const currentPendingTask = this.pendingTask;
		const pendingPromise = () => currentPendingTask;
		this.pendingTask = currentTask.then(pendingPromise, pendingPromise);

		return this.pendingTask;
	};
}
