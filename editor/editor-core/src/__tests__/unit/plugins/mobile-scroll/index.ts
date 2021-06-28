import { createEditorFactory } from '@atlaskit/editor-test-helpers/create-editor';
import { scrollIntoView } from '@atlaskit/editor-test-helpers/transactions';
import { EditorView } from 'prosemirror-view';
import createStub from 'raf-stub';
import { setKeyboardHeight } from '../../../../plugins/mobile-scroll/commands';
import { mobileScrollPluginKey } from '../../../../plugins/mobile-scroll/plugin-factory';

describe('Mobile Scroll Plugin', () => {
  const defaultScrollMargin = {
    top: 5,
    bottom: 5,
    right: 0,
    left: 0,
  };
  const defaultScrollThreshold = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  let _windowInnerHeight: number;
  let _scrollingEl: Element;
  let editorView: EditorView;
  let plugin: any;
  let appendTrSpy: jest.SpyInstance;
  let contentComponents: any[];
  let rafStub: {
    add: (cb: Function) => number;
    step: (steps?: number) => void;
    flush: () => void;
  };

  const createEditor = createEditorFactory();
  const editor = () => {
    const editor = createEditor({
      editorProps: { appearance: 'mobile' },
      pluginKey: mobileScrollPluginKey,
    });
    const { editorView } = editor;
    setKeyboardHeight(0)(editorView.state, editorView.dispatch);
    scrollIntoView(editor.editorView);
    return editor;
  };
  const getAppendedTr = () =>
    appendTrSpy.mock.results.length
      ? appendTrSpy.mock.results[0].value
      : undefined;

  beforeEach(() => {
    _windowInnerHeight = (window as any).innerHeight;
    _scrollingEl = (document as any).scrollingElement;
    (window as any).webkit = {};
    (window as any).innerHeight = 600;
    (document as any).scrollingElement = { clientHeight: 600 };

    rafStub = createStub();
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(rafStub.add);

    ({ editorView, plugin, contentComponents } = editor());
    contentComponents.forEach((component) => {
      component({ editorView });
    });
    appendTrSpy = jest.spyOn(plugin.spec, 'appendTransaction');
  });

  afterEach(() => {
    (window as any).window.innerHeight = _windowInnerHeight;
    (document as any).scrollingElement = _scrollingEl;
    ((window.requestAnimationFrame as any) as jest.SpyInstance).mockClear();
  });

  it("initially leaves scroll values so we use ProseMirror's default", () => {
    const { scrollMargin, scrollThreshold } = plugin.spec.props;
    expect([scrollMargin, scrollThreshold]).toEqual([undefined, undefined]);
  });

  describe("when keyboard's height changes", () => {
    beforeEach(() => {
      setKeyboardHeight(350)(editorView.state, editorView.dispatch);
    });

    it('updates scroll values', () => {
      const { scrollMargin, scrollThreshold } = plugin.props;
      expect([scrollMargin, scrollThreshold]).toEqual([
        { ...defaultScrollMargin, bottom: 394 },
        { ...defaultScrollThreshold, bottom: 394 },
      ]);
    });

    describe('and window.innerHeight changes', () => {
      beforeEach(() => {
        appendTrSpy.mockClear();
        (window as any).innerHeight = 800;
        scrollIntoView(editorView);
      });

      it('updates scroll values', () => {
        const { scrollMargin, scrollThreshold } = plugin.props;
        expect([scrollMargin, scrollThreshold]).toEqual([
          { ...defaultScrollMargin, bottom: 594 },
          { ...defaultScrollThreshold, bottom: 594 },
        ]);
      });

      // window.innerHeight changes as user is scrolling on iOS
      // to call scrollIntoView here would give a weird experience
      it("doesn't scroll selection into view", () => {
        expect(getAppendedTr()).toBeUndefined();
      });
    });
  });

  describe('when window.innerHeight changes', () => {
    beforeEach(() => {
      (window as any).innerHeight = 800;
      scrollIntoView(editorView);
    });

    it('updates scroll values', () => {
      const { scrollMargin, scrollThreshold } = plugin.props;
      expect([scrollMargin, scrollThreshold]).toEqual([
        { ...defaultScrollMargin, bottom: 244 },
        { ...defaultScrollThreshold, bottom: 244 },
      ]);
    });

    // window.innerHeight changes as user is scrolling on iOS
    // to call scrollIntoView here would give a weird experience
    it("doesn't scroll selection into view", () => {
      expect(getAppendedTr()).toBeUndefined();
    });

    describe('and keyboard height changes', () => {
      beforeEach(() => {
        appendTrSpy.mockClear();
        setKeyboardHeight(350)(editorView.state, editorView.dispatch);
      });

      it('updates scroll values', () => {
        const { scrollMargin, scrollThreshold } = plugin.props;
        expect([scrollMargin, scrollThreshold]).toEqual([
          { ...defaultScrollMargin, bottom: 594 },
          { ...defaultScrollThreshold, bottom: 594 },
        ]);
      });
    });
  });

  describe('when window resizes', () => {
    describe('and height is smaller ie. keyboard is shown', () => {
      it('scrolls selection into view when height stablised', () => {
        (window as any).innerHeight = 400;
        window.dispatchEvent(new Event('resize'));
        rafStub.flush();
        expect(getAppendedTr().scrolledIntoView).toEqual(true);
      });

      it("doesn't scroll selection into view before height stablises", () => {
        (window as any).innerHeight = 400;
        window.dispatchEvent(new Event('resize'));
        rafStub.step(1);
        expect(getAppendedTr()).toBeUndefined();
      });
    });

    describe('and height is bigger ie. keyboard is hidden', () => {
      it("doesn't scroll selection into view", () => {
        (window as any).innerHeight = 800;
        window.dispatchEvent(new Event('resize'));
        rafStub.flush();
        expect(getAppendedTr()).toBeUndefined();
      });
    });
  });
});
