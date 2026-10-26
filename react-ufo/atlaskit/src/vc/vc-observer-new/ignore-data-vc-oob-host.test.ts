import { expVal } from '../expVal';
import createMutationObserver from './viewport-observer/mutation-observer';

jest.mock('../expVal');

/**
 * Builds the DOM of a top-layer flag group: a popover host with no
 * `data-vc-oob`, which wraps the flag group container that has it.
 */
function createFlagHost(): { host: HTMLElement; container: HTMLElement } {
	const host = document.createElement('div');
	host.setAttribute('popover', 'manual');
	const container = document.createElement('div');
	container.setAttribute('data-vc-oob', 'true');
	container.appendChild(document.createElement('div'));
	host.appendChild(container);
	return { host, container };
}

/**
 * Builds `depth` plain wrappers around an element with `data-vc-oob`.
 */
function createNested(depth: number): HTMLElement {
	const outOfBand = document.createElement('div');
	outOfBand.setAttribute('data-vc-oob', 'true');
	let node = outOfBand;
	for (let i = 0; i < depth; i++) {
		const wrapper = document.createElement('div');
		wrapper.appendChild(node);
		node = wrapper;
	}
	return node;
}

function derefAll(refs: ReadonlyArray<WeakRef<HTMLElement>>): Array<HTMLElement | undefined> {
	return refs.map((ref) => ref.deref());
}

describe('VC mutation observer: top-layer flag host', () => {
	let onChildListMutation: jest.Mock;
	let trigger: (mutations: Array<Partial<MutationRecord>>) => void;

	beforeEach(() => {
		jest.clearAllMocks();
		onChildListMutation = jest.fn();
		jest.spyOn(window, 'MutationObserver').mockImplementation((callback) => {
			trigger = (mutations) => callback(mutations as MutationRecord[], {} as MutationObserver);
			return { observe: jest.fn(), disconnect: jest.fn() } as unknown as MutationObserver;
		});
		createMutationObserver({
			onAttributeMutation: jest.fn(),
			onChildListMutation,
		});
	});

	function setExperiment(isEnabled: boolean) {
		(expVal as jest.Mock).mockImplementation((gate: string) =>
			gate === 'cc_editor_vc_exclude_flags' ? isEnabled : false,
		);
	}

	function addNodes(nodes: HTMLElement[]) {
		trigger([
			{
				type: 'childList',
				target: document.createElement('div'),
				addedNodes: nodes as unknown as NodeList,
				removedNodes: [] as unknown as NodeList,
			},
		]);
	}

	function getReportedNodes() {
		return onChildListMutation.mock.calls.map(([{ addedNodes, removedNodes }]) => ({
			added: derefAll(addedNodes),
			removed: derefAll(removedNodes),
		}));
	}

	describe('with cc_editor_vc_exclude_flags on', () => {
		beforeEach(() => setExperiment(true));

		it('ignores the host when the first flag inserts it', () => {
			const { host } = createFlagHost();
			const sibling = document.createElement('span');

			trigger([
				{
					type: 'childList',
					target: document.createElement('div'),
					addedNodes: [host, sibling] as unknown as NodeList,
					removedNodes: [] as unknown as NodeList,
				},
			]);

			expect(getReportedNodes()).toEqual([{ added: [sibling], removed: [] }]);
		});

		it('ignores a later flag added inside the host', () => {
			const { container } = createFlagHost();

			trigger([
				{
					type: 'childList',
					target: container,
					addedNodes: [document.createElement('div')] as unknown as NodeList,
					removedNodes: [] as unknown as NodeList,
				},
			]);

			expect(onChildListMutation).not.toHaveBeenCalled();
		});

		it('ignores the host when it is removed', () => {
			const { host } = createFlagHost();

			trigger([
				{
					type: 'childList',
					target: document.createElement('div'),
					addedNodes: [] as unknown as NodeList,
					removedNodes: [host] as unknown as NodeList,
				},
			]);

			expect(getReportedNodes()).toEqual([{ added: [], removed: [] }]);
		});

		it('ignores a generic popover host with data-vc-oob content nested deep inside', () => {
			const host = document.createElement('div');
			host.setAttribute('popover', 'auto');
			host.appendChild(createNested(3));

			addNodes([host]);

			expect(getReportedNodes()).toEqual([{ added: [], removed: [] }]);
		});

		it('ignores a dialog host with data-vc-oob content inside', () => {
			const host = document.createElement('dialog');
			host.appendChild(createNested(2));

			addNodes([host]);

			expect(getReportedNodes()).toEqual([{ added: [], removed: [] }]);
		});

		it('counts a top-layer host with no data-vc-oob content', () => {
			const host = document.createElement('div');
			host.setAttribute('popover', 'auto');
			host.appendChild(document.createElement('div'));

			addNodes([host]);

			expect(getReportedNodes()).toEqual([{ added: [host], removed: [] }]);
		});

		it('counts an ordinary node with data-vc-oob content inside, without searching it', () => {
			const node = document.createElement('div');
			node.appendChild(createNested(1));
			const querySelector = jest.spyOn(node, 'querySelector');

			addNodes([node]);

			expect(getReportedNodes()).toEqual([{ added: [node], removed: [] }]);
			expect(querySelector).not.toHaveBeenCalled();
		});
	});

	describe('with cc_editor_vc_exclude_flags off', () => {
		beforeEach(() => setExperiment(false));

		it('counts the host when the first flag inserts it', () => {
			const { host } = createFlagHost();

			trigger([
				{
					type: 'childList',
					target: document.createElement('div'),
					addedNodes: [host] as unknown as NodeList,
					removedNodes: [] as unknown as NodeList,
				},
			]);

			expect(getReportedNodes()).toEqual([{ added: [host], removed: [] }]);
		});

		it('counts a later flag added inside the host', () => {
			const { container } = createFlagHost();
			const flag = document.createElement('div');

			trigger([
				{
					type: 'childList',
					target: container,
					addedNodes: [flag] as unknown as NodeList,
					removedNodes: [] as unknown as NodeList,
				},
			]);

			expect(getReportedNodes()).toEqual([{ added: [flag], removed: [] }]);
		});

		it('counts a generic popover host with data-vc-oob content inside', () => {
			const host = document.createElement('div');
			host.setAttribute('popover', 'auto');
			host.appendChild(createNested(3));

			addNodes([host]);

			expect(getReportedNodes()).toEqual([{ added: [host], removed: [] }]);
		});

		it('counts the host when it is removed', () => {
			const { host } = createFlagHost();

			trigger([
				{
					type: 'childList',
					target: document.createElement('div'),
					addedNodes: [] as unknown as NodeList,
					removedNodes: [host] as unknown as NodeList,
				},
			]);

			expect(getReportedNodes()).toEqual([{ added: [], removed: [host] }]);
		});
	});
});
