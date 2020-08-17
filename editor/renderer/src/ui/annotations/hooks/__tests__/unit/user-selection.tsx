import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  isRangeInsideOfRendererContainer,
  useUserSelectionRange,
} from '../../user-selection';

let container: HTMLElement | null;
let createRangeMock: jest.SpyInstance;
beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  createRangeMock = jest.spyOn(document, 'createRange');
  createRangeMock.mockImplementation(() => {
    return new Range();
  });
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
  createRangeMock.mockRestore();
});

describe('Annotations: SelectionInlineCommentMounter', () => {
  describe('#isRangeInsideOfRendererContainer', () => {
    let rendererDOM: HTMLElement;
    beforeEach(() => {
      render(
        <div>
          <section id="before-container">
            <span className="start-selection">Melancia</span>
            <span>Mamao</span>
            <div>
              <small className="end-selection">morango</small>
            </div>
          </section>
          <section id="renderer-container">
            <span>
              <span className="start-selection">
                K<small>e</small>
                <strong className="end-selection">VIN</strong>nho
              </span>
            </span>
          </section>
          <ul id="after-container">
            <li>
              <span className="start-selection">
                Hello <strong> World</strong>
              </span>
            </li>
            <li>
              <span className="end-selection">WELcome</span>
            </li>
          </ul>
        </div>,
        container,
      );

      rendererDOM = document.querySelector(
        '#renderer-container',
      ) as HTMLElement;
    });

    describe('when the range is inside of the container', () => {
      it('shoudl return true', () => {
        const range = document.createRange();
        const start = rendererDOM.querySelector('.start-selection')!;
        const end = rendererDOM.querySelector('.end-selection')!;

        range.setStart(start.childNodes[0], 1);
        range.setEnd(end.childNodes[0], 3);

        expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(true);
      });
    });

    describe('when the range starts at before of container and ends after it', () => {
      it('should return false', () => {
        const range = document.createRange();

        const beforeContainer = document.querySelector(
          '#before-container',
        ) as HTMLElement;
        const startBefore = beforeContainer.querySelector('.start-selection')!;

        const afterContainer = document.querySelector(
          '#after-container',
        ) as HTMLElement;
        const endAfter = afterContainer.querySelector('.end-selection')!;

        range.setStart(startBefore.childNodes[0], 1);
        range.setEnd(endAfter.childNodes[0], 3);

        expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(
          false,
        );
      });
    });

    describe('when the range starts at before of container and ends inside', () => {
      it('should return false', () => {
        const range = document.createRange();

        const beforeContainer = document.querySelector(
          '#before-container',
        ) as HTMLElement;
        const startBefore = beforeContainer.querySelector('.start-selection')!;
        const endInside = rendererDOM.querySelector('.end-selection')!;

        range.setStart(startBefore.childNodes[0], 1);
        range.setEnd(endInside.childNodes[0], 3);

        expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(
          false,
        );
      });
    });

    describe('when the range starts at inside of container and ends after', () => {
      it('should return false', () => {
        const range = document.createRange();

        const afterContainer = document.querySelector(
          '#after-container',
        ) as HTMLElement;
        const startInside = rendererDOM.querySelector('.start-selection')!;
        const endAfter = afterContainer.querySelector('.end-selection')!;

        range.setStart(startInside.childNodes[0], 1);
        range.setEnd(endAfter.childNodes[0], 3);

        expect(isRangeInsideOfRendererContainer(rendererDOM, range)).toBe(
          false,
        );
      });
    });

    describe('when the range is outside of the container', () => {
      it('should return false', () => {
        const beforeContainer = document.querySelector(
          '#before-container',
        ) as HTMLElement;
        const beforeContainerRange = document.createRange();
        const startBefore = beforeContainer.querySelector('.start-selection')!;
        const endBefore = beforeContainer.querySelector('.end-selection')!;

        beforeContainerRange.setStart(startBefore.childNodes[0], 1);
        beforeContainerRange.setEnd(endBefore.childNodes[0], 3);

        const afterContainer = document.querySelector(
          '#after-container',
        ) as HTMLElement;
        const afterContainerRange = document.createRange();
        const startAfter = afterContainer.querySelector('.start-selection')!;
        const endAfter = afterContainer.querySelector('.end-selection')!;

        afterContainerRange.setStart(startAfter.childNodes[0], 1);
        afterContainerRange.setEnd(endAfter.childNodes[0], 3);

        expect(
          isRangeInsideOfRendererContainer(rendererDOM, beforeContainerRange),
        ).toBe(false);
        expect(
          isRangeInsideOfRendererContainer(rendererDOM, afterContainerRange),
        ).toBe(false);
      });
    });
  });

  describe('#useUserSelectionRange', () => {
    let rendererDOM: HTMLElement;
    type Props = {
      shouldAttachMouseUpEvent: boolean;
      rendererRef: React.RefObject<HTMLDivElement>;
    };
    const DummyComponent = (props: Props) => {
      useUserSelectionRange(props);

      return null;
    };

    beforeEach(() => {
      render(<div id="renderer-container"></div>, container);

      rendererDOM = document.querySelector(
        '#renderer-container',
      ) as HTMLElement;
    });

    describe('when a component is render using this hook', () => {
      describe('after mounting', () => {
        it('should attach a listener at the document selection change event', () => {
          jest.spyOn(document, 'addEventListener');

          const fakeRef = { current: rendererDOM } as React.RefObject<
            HTMLDivElement
          >;
          expect(document.addEventListener).toHaveBeenCalledTimes(0);
          act(() => {
            render(
              <DummyComponent
                shouldAttachMouseUpEvent={true}
                rendererRef={fakeRef}
              />,
              rendererDOM,
            );
          });
          expect(document.addEventListener).toHaveBeenCalledTimes(1);
          expect(document.addEventListener).toHaveBeenCalledWith(
            'selectionchange',
            expect.any(Function),
          );
        });
      });

      describe('after unmounting', () => {
        it('should remove should the listener from the document selection change event', () => {
          jest.spyOn(document, 'removeEventListener');

          const fakeRef = { current: rendererDOM } as React.RefObject<
            HTMLDivElement
          >;
          expect(document.removeEventListener).toHaveBeenCalledTimes(0);
          act(() => {
            render(
              <DummyComponent
                shouldAttachMouseUpEvent={true}
                rendererRef={fakeRef}
              />,
              rendererDOM,
            );
          });

          act(() => {
            unmountComponentAtNode(rendererDOM);
          });
          expect(document.removeEventListener).toHaveBeenCalledTimes(1);
          expect(document.removeEventListener).toHaveBeenCalledWith(
            'selectionchange',
            expect.any(Function),
          );
        });
      });
    });
  });
});
