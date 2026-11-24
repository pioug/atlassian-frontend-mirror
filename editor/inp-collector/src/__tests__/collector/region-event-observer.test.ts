import { RegionEventObserver } from '../../collector/region-event-observer';
import { dispatchInteraction } from '../_event-timing';

describe('RegionEventObserver', () => {
	let reported: Event[];
	let observer: RegionEventObserver;
	/** An element of the region, something in it, and something that is not. */
	let region: HTMLElement;
	let content: HTMLElement;
	let elsewhere: HTMLElement;

	const reportedTimeStamps = () => reported.map((event) => event.timeStamp);
	const start = () => observer.start((event: Event) => reported.push(event));

	beforeEach(() => {
		reported = [];
		observer = new RegionEventObserver();

		region = document.createElement('div');
		content = region.appendChild(document.createElement('p'));
		elsewhere = document.createElement('div');

		start();
	});

	afterEach(() => {
		observer.stop();
	});

	it('reports the events of an interaction anywhere in the region', () => {
		observer.addElement(region);

		dispatchInteraction(content, 'pointerdown', 100);
		dispatchInteraction(content, 'pointerup', 150);
		dispatchInteraction(region, 'click', 160);

		// Asserted field by field: an event reaches the whole document through `view`, which a deep
		// comparison would try to walk.
		expect(reported.map((event) => event.type)).toEqual(['pointerdown', 'pointerup', 'click']);
		expect(reportedTimeStamps()).toEqual([100, 150, 160]);
	});

	it('reports nothing that happened outside the region', () => {
		observer.addElement(region);

		dispatchInteraction(elsewhere, 'keydown', 100);

		expect(reported).toEqual([]);
	});

	it('does not listen for events that are not part of an interaction', () => {
		observer.addElement(region);

		dispatchInteraction(content, 'pointermove', 100);
		dispatchInteraction(content, 'scroll', 110);
		dispatchInteraction(content, 'keydown', 120);

		expect(reported.map((event) => event.type)).toEqual(['keydown']);
	});

	describe('several elements', () => {
		it('reports the events of each of them', () => {
			observer.addElement(region);
			observer.addElement(elsewhere);

			dispatchInteraction(content, 'keydown', 100);
			dispatchInteraction(elsewhere, 'keydown', 110);

			expect(reportedTimeStamps()).toEqual([100, 110]);
		});

		it('reports an event passing through two of them once', () => {
			observer.addElement(region);
			observer.addElement(content);

			dispatchInteraction(content, 'keydown', 100);

			expect(reportedTimeStamps()).toEqual([100]);
		});
	});

	describe('removing an element', () => {
		it('stops reporting its events', () => {
			const remove = observer.addElement(region);

			remove();
			dispatchInteraction(content, 'keydown', 100);

			expect(reported).toEqual([]);
		});

		it('listens to an element added twice once, until both are removed', () => {
			const removeFirst = observer.addElement(region);
			const removeSecond = observer.addElement(region);

			dispatchInteraction(content, 'keydown', 100);
			removeFirst();
			dispatchInteraction(content, 'keydown', 110);
			removeSecond();
			dispatchInteraction(content, 'keydown', 120);

			expect(reportedTimeStamps()).toEqual([100, 110]);
		});

		it('removes a registration once however often it is called', () => {
			const removeFirst = observer.addElement(region);
			observer.addElement(region);

			removeFirst();
			removeFirst();
			dispatchInteraction(content, 'keydown', 100);

			expect(reportedTimeStamps()).toEqual([100]);
		});
	});

	describe('starting and stopping', () => {
		it('listens to the elements added before it started', () => {
			observer.stop();
			observer.addElement(region);

			dispatchInteraction(content, 'keydown', 100);
			start();
			dispatchInteraction(content, 'keydown', 110);

			expect(reportedTimeStamps()).toEqual([110]);
		});

		it('stops reporting once stopped, and keeps its elements for the next start', () => {
			observer.addElement(region);

			observer.stop();
			dispatchInteraction(content, 'keydown', 100);
			start();
			dispatchInteraction(content, 'keydown', 110);

			expect(reportedTimeStamps()).toEqual([110]);
		});
	});
});
