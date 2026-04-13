import { spaceInviteScheduler } from './spaceInviteScheduler';

const { scheduleInvite, cancelInvite, flushAll } = spaceInviteScheduler;

describe('spaceInviteScheduler', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('scheduleInvite', () => {
		it('should call callback after 15 seconds', () => {
			const callback = jest.fn();
			scheduleInvite('team-1', 'container-1', callback);

			expect(callback).not.toHaveBeenCalled();
			jest.advanceTimersByTime(15_000);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should not call callback before 15 seconds', () => {
			const callback = jest.fn();
			scheduleInvite('team-1', 'container-1', callback);

			jest.advanceTimersByTime(14_999);
			expect(callback).not.toHaveBeenCalled();
		});

		it('should reset the timer when called again for the same team/container pair', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			scheduleInvite('team-1', 'container-1', callback1);
			jest.advanceTimersByTime(7_500);

			scheduleInvite('team-1', 'container-1', callback2);
			jest.advanceTimersByTime(7_500);

			expect(callback1).not.toHaveBeenCalled();
			expect(callback2).not.toHaveBeenCalled();

			jest.advanceTimersByTime(7_500);
			expect(callback1).not.toHaveBeenCalled();
			expect(callback2).toHaveBeenCalledTimes(1);
		});

		it('should handle independent timers for different team/container pairs', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			scheduleInvite('team-1', 'container-1', callback1);
			jest.advanceTimersByTime(7_500);

			scheduleInvite('team-2', 'container-2', callback2);
			jest.advanceTimersByTime(7_500);

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).not.toHaveBeenCalled();

			jest.advanceTimersByTime(7_500);
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});

	describe('cancelInvite', () => {
		it('should prevent the scheduled callback from firing and return true', () => {
			const callback = jest.fn();
			scheduleInvite('team-1', 'container-1', callback);

			expect(cancelInvite('team-1', 'container-1')).toBe(true);
			jest.advanceTimersByTime(15_000);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should not affect other scheduled invites', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			scheduleInvite('team-1', 'container-1', callback1);
			scheduleInvite('team-2', 'container-2', callback2);

			cancelInvite('team-1', 'container-1');
			jest.advanceTimersByTime(15_000);

			expect(callback1).not.toHaveBeenCalled();
			expect(callback2).toHaveBeenCalledTimes(1);
		});

		it('should return false when no invite is pending', () => {
			expect(cancelInvite('team-1', 'container-1')).toBe(false);
		});

		it('should match when schedule uses full ARI and cancel uses bare ID', () => {
			const callback = jest.fn();
			scheduleInvite(
				'ari:cloud:identity::team/abc-123',
				'ari:cloud:jira:site-1:project/10000',
				callback,
			);

			expect(cancelInvite('abc-123', '10000')).toBe(true);
			jest.advanceTimersByTime(15_000);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should match when schedule uses bare ID and cancel uses full ARI', () => {
			const callback = jest.fn();
			scheduleInvite('abc-123', '10000', callback);

			expect(
				cancelInvite('ari:cloud:identity::team/abc-123', 'ari:cloud:jira:site-1:project/10000'),
			).toBe(true);
			jest.advanceTimersByTime(15_000);

			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe('flushAll', () => {
		it('should fire all pending callbacks immediately', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			scheduleInvite('team-1', 'container-1', callback1);
			scheduleInvite('team-2', 'container-2', callback2);

			flushAll();

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});

		it('should not re-fire callbacks when original timers expire after flush', () => {
			const callback = jest.fn();
			scheduleInvite('team-1', 'container-1', callback);

			flushAll();
			expect(callback).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(15_000);
			expect(callback).toHaveBeenCalledTimes(1);
		});

		it('should be a no-op when nothing is pending', () => {
			expect(() => flushAll()).not.toThrow();
		});

		it('should not affect subsequently scheduled invites', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			scheduleInvite('team-1', 'container-1', callback1);
			flushAll();

			scheduleInvite('team-1', 'container-1', callback2);
			jest.advanceTimersByTime(15_000);

			expect(callback1).toHaveBeenCalledTimes(1);
			expect(callback2).toHaveBeenCalledTimes(1);
		});
	});
});
