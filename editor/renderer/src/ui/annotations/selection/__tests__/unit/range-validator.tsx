import './range-validator.mock';
import React from 'react';
import { render } from 'react-dom';
import { SelectionRangeValidator } from '../../range-validator';
// @ts-ignore
import MounterMock from '../../mounter';
import { RendererContext } from '../../../../RendererActionsContext';
import RendererActions from '../../../../../actions/index';

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

describe('Annotations: SelectionRangeValidator', () => {
  it('should call the SelectionInlineCommentMounter with the positions calculated by the actions', () => {
    let ref: React.RefObject<HTMLDivElement> = React.createRef();
    const spy = jest.spyOn(MounterMock, 'SelectionInlineCommentMounter');
    const documentPosition = { from: 0, to: 10 };
    const applyAnnotation = () => {};
    const generateAnnotationIndexMatch = () => false;
    // @ts-ignore
    const actions = {
      getPositionFromRange: jest.fn(() => documentPosition),
      isValidAnnotationPosition: jest.fn(() => true),
      applyAnnotation,
      generateAnnotationIndexMatch,
    } as RendererActions;
    const selectionComponent = () => {
      return null;
    };

    render(
      <RendererContext.Provider value={actions}>
        <div>
          <div ref={ref} id="renderer-container">
            <span className="start-selection">Melancia</span>
            <span>Mamao</span>
            <div>
              <small className="end-selection">morango</small>
            </div>
          </div>
          <SelectionRangeValidator
            rendererRef={ref}
            selectionComponent={selectionComponent}
            applyAnnotationDraftAt={jest.fn()}
            clearAnnotationDraft={jest.fn()}
          />
        </div>
        ,
      </RendererContext.Provider>,
      container,
    );

    expect(spy.mock.calls[0][0]).toMatchObject({
      documentPosition,
      isAnnotationAllowed: true,
    });
  });
});
