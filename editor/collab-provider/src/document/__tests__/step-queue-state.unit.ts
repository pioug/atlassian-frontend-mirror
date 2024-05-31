import { StepQueueState } from '../step-queue-state';

describe('Step Queue State', () => {
	it('Sorts and orders steps added to the queue by version', () => {
		const stepQueue = new StepQueueState();
		stepQueue.queueSteps({ version: 1, steps: [] });
		stepQueue.queueSteps({ version: 3, steps: [] }); // Note out of order versions
		stepQueue.queueSteps({ version: 2, steps: [] });

		expect(stepQueue.getQueue()).toEqual([
			{ version: 1, steps: [] },
			{ version: 2, steps: [] },
			{ version: 3, steps: [] },
		]);
	});

	it('uses condition to filter the queue', () => {
		const stepQueue = new StepQueueState();
		stepQueue.queueSteps({ version: 1, steps: [] });
		stepQueue.queueSteps({ version: 2, steps: [] });
		stepQueue.queueSteps({ version: 3, steps: [] });

		const condition = jest.fn().mockImplementation((step) => {
			return step.version >= 2;
		});
		stepQueue.filterQueue(condition);

		expect(stepQueue.getQueue()).toEqual([
			// Version one got filtered out
			{ steps: [], version: 2 },
			{ steps: [], version: 3 },
		]);
		expect(condition).toBeCalledTimes(3); // Once for each step added to the queue
	});

	it('Pauses and resumes the queue', () => {
		const stepQueue = new StepQueueState();
		stepQueue.pauseQueue();
		expect(stepQueue.isPaused()).toEqual(true);
		stepQueue.resumeQueue();
		expect(stepQueue.isPaused()).toEqual(false);
	});

	it('Constructs with correct defaults', () => {
		const stepQueue = new StepQueueState();
		expect(stepQueue.isPaused()).toEqual(false);
		expect(stepQueue.getQueue()).toEqual([]);
	});
});
