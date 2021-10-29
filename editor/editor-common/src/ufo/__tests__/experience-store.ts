const mockStart = jest.fn();
const mockAddMetadata = jest.fn();
const mockMark = jest.fn();
const mockSuccess = jest.fn();
const mockFailure = jest.fn();
const mockAbort = jest.fn();
let mockState = { id: 'STARTED', final: false };

jest.mock('@atlaskit/ufo', () => {
  return {
    ...jest.requireActual<Object>('@atlaskit/ufo'),
    UFOExperience: jest.fn().mockImplementation((id: string) => {
      return {
        id,
        state: mockState,
        start: mockStart,
        addMetadata: mockAddMetadata,
        mark: mockMark,
        success: mockSuccess,
        failure: mockFailure,
        abort: mockAbort,
      };
    }),
  };
});

import { EditorExperience, ExperienceStore } from '../experience-store';

describe('Experience store', () => {
  const numExperiences = Object.values(EditorExperience).length;
  let experienceStore: ExperienceStore;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    mockState = { id: 'STARTED', final: false };
    // don't want the overhead of importing & creating a new EditorView so just cheating
    // with an empty object
    experienceStore = ExperienceStore.getInstance({} as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('returns a new store instance for a different EditorView', () => {
      const abcStore = ExperienceStore.getInstance({ abc: 'abc' } as any);
      const defStore = ExperienceStore.getInstance({ def: 'def' } as any);
      expect(abcStore).not.toBe(defStore);
    });

    it('reuses same store instance for same EditorView', () => {
      const view = {} as any;
      const store1 = ExperienceStore.getInstance(view);
      const store2 = ExperienceStore.getInstance(view);
      expect(store1).toBe(store2);
    });

    it('returns new instance for same EditorView if forceNewInstance option set', () => {
      const view = {} as any;
      const store1 = ExperienceStore.getInstance(view);
      const store2 = ExperienceStore.getInstance(view, {
        forceNewInstance: true,
      });
      expect(store1).not.toBe(store2);
    });
  });

  describe('initialisation', () => {
    it('creates load experience', () => {
      expect(experienceStore.get(EditorExperience.loadEditor)).toBeDefined();
    });

    it('creates type experience', () => {
      expect(experienceStore.get(EditorExperience.typing)).toBeDefined();
    });

    it('creates interaction experience', () => {
      expect(experienceStore.get(EditorExperience.interaction)).toBeDefined();
    });

    it("doesn't start any experiences", () => {
      expect(mockStart).not.toHaveBeenCalled();
    });
  });

  describe('getActive', () => {
    it('gets active experience', () => {
      const experience = experienceStore.getActive(EditorExperience.loadEditor);
      expect(experience).toBeDefined();
    });

    it('returns undefined for inactive experience', () => {
      mockState = { id: 'SUCCEEDED', final: true };
      experienceStore = ExperienceStore.getInstance({} as any);

      const experience = experienceStore.getActive(EditorExperience.loadEditor);
      expect(experience).toBeUndefined();
    });

    it('returns undefined when experience does not exist', () => {
      const experience = experienceStore.getActive('does-not-exist');
      expect(experience).toBeUndefined();
    });
  });

  describe('start', () => {
    it('starts UFO experience', () => {
      experienceStore.start(EditorExperience.loadEditor);
      expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('starts UFO experience with specified start time', () => {
      experienceStore.start(EditorExperience.loadEditor, 200);
      expect(mockStart).toHaveBeenCalledWith(200);
    });
  });

  describe('addMetadata', () => {
    it('adds metadata to experience', () => {
      experienceStore.addMetadata(EditorExperience.loadEditor, {
        some: 'data',
      });
      expect(mockAddMetadata).toHaveBeenCalledWith({ some: 'data' });
    });
  });

  describe('mark', () => {
    it('adds performance mark to experience', () => {
      experienceStore.mark(EditorExperience.loadEditor, 'tti', 4000);
      expect(mockMark).toHaveBeenCalledWith('tti', 4000);
    });
  });

  describe('success', () => {
    it('succeeds experience', () => {
      experienceStore.success(EditorExperience.loadEditor);
      expect(mockSuccess).toHaveBeenCalled();
    });

    it('succeeds experience passing through metadata', () => {
      experienceStore.success(EditorExperience.loadEditor, {
        some: 'data',
      });
      expect(mockSuccess).toHaveBeenCalledWith({ metadata: { some: 'data' } });
    });

    it("doesn't succeed experience if already completed", () => {
      mockState = { id: 'SUCCEEDED', final: true };
      experienceStore = ExperienceStore.getInstance({} as any);

      experienceStore.success(EditorExperience.loadEditor);
      expect(mockSuccess).not.toHaveBeenCalled();
    });
  });

  describe('fail', () => {
    it('fails experience', () => {
      experienceStore.fail(EditorExperience.loadEditor);
      expect(mockFailure).toHaveBeenCalled();
    });

    it('fails experience passing through metadata', () => {
      experienceStore.fail(EditorExperience.loadEditor, {
        some: 'data',
      });
      expect(mockFailure).toHaveBeenCalledWith({ metadata: { some: 'data' } });
    });

    it("doesn't fail experience if already completed", () => {
      mockState = { id: 'SUCCEEDED', final: true };
      experienceStore = ExperienceStore.getInstance({} as any);

      experienceStore.fail(EditorExperience.loadEditor);
      expect(mockFailure).not.toHaveBeenCalled();
    });
  });

  describe('abort', () => {
    it('aborts experience', () => {
      experienceStore.abort(EditorExperience.loadEditor);
      jest.runAllTimers();

      expect(mockAbort).toHaveBeenCalled();
    });

    it('aborts experience passing through metadata', () => {
      experienceStore.abort(EditorExperience.loadEditor, {
        some: 'data',
      });
      jest.runAllTimers();

      expect(mockAbort).toHaveBeenCalledWith({ metadata: { some: 'data' } });
    });

    it("doesn't abort experience if already completed", () => {
      mockState = { id: 'SUCCEEDED', final: true };
      experienceStore = ExperienceStore.getInstance({} as any);

      experienceStore.abort(EditorExperience.loadEditor);
      jest.runAllTimers();

      expect(mockAbort).not.toHaveBeenCalled();
    });

    it('waits before aborting experience', () => {
      experienceStore.abort(EditorExperience.loadEditor);
      expect(mockAbort).not.toHaveBeenCalled();
      jest.runAllTimers();

      expect(mockAbort).toHaveBeenCalled();
    });
  });

  describe('failAll', () => {
    it('fails all experiences in store', () => {
      experienceStore.failAll();
      expect(mockFailure).toHaveBeenCalledTimes(numExperiences);
    });

    it('fails all experiences in store passing through metadata', () => {
      experienceStore.failAll({ some: 'data' });
      expect(mockFailure).toHaveBeenCalledWith({ metadata: { some: 'data' } });
    });
  });

  describe('abortAll', () => {
    it('aborts all experiences in store', () => {
      experienceStore.abortAll();
      jest.runAllTimers();

      expect(mockAbort).toHaveBeenCalledTimes(numExperiences);
    });

    it('aborts all experiences in store passing through metadata', () => {
      experienceStore.abortAll({ some: 'data' });
      jest.runAllTimers();

      expect(mockAbort).toHaveBeenCalledWith({ metadata: { some: 'data' } });
    });
  });
});
