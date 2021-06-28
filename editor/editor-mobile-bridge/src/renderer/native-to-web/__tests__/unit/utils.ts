import { ScrollToContentNode } from '../../bridge';
import {
  getElementScrollOffsetByNodeType,
  scrollToElement,
  getElementScrollOffset,
  isValidNodeTypeForScroll,
} from '../../utils';

describe('utils', () => {
  describe('#scrollToElement', () => {
    let scrollIntoViewMock: jest.SpyInstance;

    beforeEach(() => {
      scrollIntoViewMock = HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    afterEach(() => {
      document.body.innerHTML = '';
      scrollIntoViewMock.mockRestore();
    });

    describe('when the element do not exist', () => {
      it('should not call the scrollIntoView function', () => {
        scrollToElement(ScrollToContentNode.MENTION, 'non-id');

        expect(scrollIntoViewMock).not.toHaveBeenCalled();
      });
    });

    describe('when the element exist', () => {
      beforeEach(() => {
        document.body.innerHTML = `
        <body>
          <span data-mention-id='id'</span>
        </body>
      `;
      });

      it('should call the scrollIntoView function', () => {
        scrollToElement(ScrollToContentNode.MENTION, 'id');

        expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('#getElementScrollOffset', () => {
    let getBoundingClientRectMock: jest.SpyInstance;
    let scrollTopMock: jest.SpyInstance;
    let scrollLeftMock: jest.SpyInstance;

    beforeEach(() => {
      getBoundingClientRectMock = jest.spyOn(
        HTMLElement.prototype,
        'getBoundingClientRect',
      );

      scrollTopMock = jest.spyOn(HTMLElement.prototype, 'scrollTop', 'get');

      scrollLeftMock = jest.spyOn(HTMLElement.prototype, 'scrollLeft', 'get');
    });

    afterEach(() => {
      document.body.innerHTML = '';
      getBoundingClientRectMock.mockRestore();
      scrollTopMock.mockRestore();
      scrollLeftMock.mockRestore();
    });

    describe('when the element do not exist', () => {
      it('should return a default object', () => {
        const result = getElementScrollOffset('.my-selector');

        expect(result).toEqual({
          x: -1,
          y: -1,
        });
      });
    });

    describe('when the element exist', () => {
      it('should call the getBoundingClientRect function', () => {
        document.body.innerHTML = '<input class="my-selector">';
        getElementScrollOffset('.my-selector');

        expect(getBoundingClientRectMock).toHaveBeenCalledTimes(1);
      });

      it('should return the scroll offset', () => {
        const fakeTopValue = 10;
        const fakeScrollTopValue = 15;

        const fakeLeftValue = 3;
        const fakeScrollLeftValue = 9;

        document.body.innerHTML = '<input class="my-selector">';

        getBoundingClientRectMock.mockReturnValue({
          top: fakeTopValue,
          left: fakeLeftValue,
        });

        scrollTopMock.mockReturnValue(fakeScrollTopValue);
        scrollLeftMock.mockReturnValue(fakeScrollLeftValue);

        const result = getElementScrollOffset('.my-selector');

        expect(result).toEqual({
          y: fakeTopValue + fakeScrollTopValue,
          x: fakeLeftValue + fakeScrollLeftValue,
        });
      });
    });
  });

  describe('#getElementScrollOffsetByNodeType', () => {
    let getBoundingClientRectMock: jest.SpyInstance;
    let scrollTopMock: jest.SpyInstance;
    let scrollLeftMock: jest.SpyInstance;
    const fakeTopValue = 10;
    const fakeScrollTopValue = 15;
    const fakeLeftValue = 3;
    const fakeScrollLeftValue = 9;
    const mentionId = 'mentionId';
    const taskId = 'taskId';
    const decisionId = 'decisionId';
    const headingId = 'headingId';
    const inlineCommentId = 'inlineCommentId';

    beforeEach(() => {
      getBoundingClientRectMock = jest.spyOn(
        HTMLElement.prototype,
        'getBoundingClientRect',
      );

      scrollTopMock = jest.spyOn(HTMLElement.prototype, 'scrollTop', 'get');

      scrollLeftMock = jest.spyOn(HTMLElement.prototype, 'scrollLeft', 'get');
      document.body.innerHTML = `
        <body>
          <span data-mention-id='${mentionId}'</span>
          <div data-task-local-id="${taskId}"></div>
          <li data-decision-local-id="${decisionId}">/div>
          <h1 id="${headingId}"></h1>
          <span data-mark-type="annotation" data-mark-annotation-type="inlineComment" data-id="${inlineCommentId}">LOL</span>
        </body>
      `;

      getBoundingClientRectMock.mockReturnValue({
        top: fakeTopValue,
        left: fakeLeftValue,
      });

      scrollTopMock.mockReturnValue(fakeScrollTopValue);
      scrollLeftMock.mockReturnValue(fakeScrollLeftValue);
    });

    afterEach(() => {
      document.body.innerHTML = '';
      getBoundingClientRectMock.mockRestore();
      scrollTopMock.mockRestore();
      scrollLeftMock.mockRestore();
    });

    describe.each<[ScrollToContentNode, string]>([
      [ScrollToContentNode.MENTION, mentionId],
      [ScrollToContentNode.ACTION, taskId],
      [ScrollToContentNode.DECISION, decisionId],
      [ScrollToContentNode.HEADING, headingId],
      [ScrollToContentNode.INLINE_COMMENT, inlineCommentId],
    ])('when the node type is %s', (nodeType, id) => {
      it('should return the offset', () => {
        const result = getElementScrollOffsetByNodeType(nodeType, id);

        expect(result).toEqual({
          y: fakeTopValue + fakeScrollTopValue,
          x: fakeLeftValue + fakeScrollLeftValue,
        });
      });
    });
  });

  describe('#isValidNodeTypeForScroll', () => {
    it.each(Object.values(ScrollToContentNode))(
      'should validate %s ScrollToContentNode value',
      (nodeType) => {
        expect(isValidNodeTypeForScroll(nodeType)).toBe(true);
      },
    );
  });
});
