import React from 'react';
import { render } from 'react-dom';
import { updateWindowSelectionAroundDraft, dataAttributes } from '../../dom';

let container: HTMLElement | null;
let createRangeMock: jest.SpyInstance;
let rangeMock: {
  setStart: jest.Mock;
  setEndAfter: jest.Mock;
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  createRangeMock = jest.spyOn(document, 'createRange');

  rangeMock = {
    setStart: jest.fn(),
    setEndAfter: jest.fn(),
  };

  createRangeMock.mockImplementation(() => {
    return rangeMock;
  });
});

afterEach(() => {
  document.body.removeChild(container!);
  container = null;
  rangeMock.setStart.mockReset();
  rangeMock.setEndAfter.mockReset();
  createRangeMock.mockRestore();
});

describe('Annotations: draft/dom', () => {
  describe('#updateWindowSelectionAroundDraft', () => {
    const position = {
      from: 10,
      to: 15,
    };

    describe('when there is no selection', () => {
      it('should return false', () => {
        const result = updateWindowSelectionAroundDraft(position);

        expect(result).toBe(false);
      });
    });

    describe('when there selection', () => {
      let selectionMock: {
        removeAllRanges: jest.Mock;
        addRange: jest.Mock;
      };
      let getSelectionSpy: jest.SpyInstance;
      beforeEach(() => {
        selectionMock = {
          removeAllRanges: jest.fn(),
          addRange: jest.fn(),
        };
        getSelectionSpy = jest.spyOn(window, 'getSelection');
        getSelectionSpy.mockImplementation(() => selectionMock);
      });

      afterEach(() => {
        getSelectionSpy.mockRestore();
      });

      describe('when there is no draft node at the dom', () => {
        it('should return false', () => {
          const result = updateWindowSelectionAroundDraft(position);

          expect(result).toBe(false);
        });
      });

      describe('when there is draft nodes at the dom', () => {
        beforeEach(() => {
          render(
            <div>
              <p>
                Martin
                <mark id="first" {...dataAttributes(position)}>
                  {' '}
                  Luther King
                </mark>
              </p>
              <p>
                <mark id="last" {...dataAttributes(position)}>
                  Malcolm X
                </mark>
              </p>
            </div>,
            container,
          );
        });

        it('should return true', () => {
          const result = updateWindowSelectionAroundDraft(position);
          expect(result).toBe(true);
        });

        it('should call setStart with the first mark', () => {
          const firstMark = document.querySelector('#first');
          updateWindowSelectionAroundDraft(position);

          expect(rangeMock.setStart).toHaveBeenCalledWith(firstMark, 0);
        });

        it('should call setEndAfter with the last mark', () => {
          const lastMark = document.querySelector('#last');
          updateWindowSelectionAroundDraft(position);
          expect(rangeMock.setEndAfter).toHaveBeenCalledWith(lastMark);
        });
      });
    });
  });
});
