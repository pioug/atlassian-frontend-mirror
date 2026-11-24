/**
 * Every consumer of the history fork imports the diagnostics module, whether or not the backend
 * agent undo feature is on. Importing it must therefore leave `window` untouched; the DevTools
 * entry points appear only once a session opts in. This lives in its own file because the sibling
 * `agent-undo-diagnostics.ts` shares module state across tests and cannot observe a pristine import.
 */
import { agentUndoDiagnostics } from '../../src/diagnostics/agent-undo-diagnostics';

describe('agent undo diagnostics browser globals', () => {
	afterAll(() => {
		agentUndoDiagnostics.disable();
		delete window.__EDITOR_AGENT_UNDO_DEBUG__;
	});

	it('installs nothing on import', () => {
		expect(window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__).toBeUndefined();
		expect(window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__).toBeUndefined();
		expect(window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__).toBeUndefined();
	});

	it('installs nothing while recording is checked but not enabled', () => {
		expect(agentUndoDiagnostics.isEnabled()).toBe(false);
		agentUndoDiagnostics.record('batch-promoted', 'tab-1', 'inv-1');

		expect(window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__).toBeUndefined();
		expect(window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__).toBeUndefined();
		expect(window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__).toBeUndefined();
	});

	it('installs the entry points the first time recording is found enabled', () => {
		window.__EDITOR_AGENT_UNDO_DEBUG__ = true;

		expect(agentUndoDiagnostics.isEnabled()).toBe(true);
		expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_EXPORT__).toBe('function');
		expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_CLEAR__).toBe('function');
		expect(typeof window.__EDITOR_AGENT_UNDO_DEBUG_DISABLE__).toBe('function');
	});
});
