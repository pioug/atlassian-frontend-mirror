import { MouseEvent } from 'react';
import { handleClickCommon } from '../../../BlockCard/utils/handlers';

describe('handleClickCommon', () => {
  let onClickMock: jest.Mock;
  let eventMock: MouseEvent<HTMLElement>;

  beforeEach(() => {
    onClickMock = jest.fn();
    eventMock = ({
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    } as unknown) as MouseEvent<HTMLElement>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('stops propagation of event if onClick is passed', () => {
    handleClickCommon(eventMock, onClickMock);
    expect(eventMock.preventDefault).toHaveBeenCalledTimes(1);
    expect(eventMock.stopPropagation).toHaveBeenCalledTimes(1);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('does not stop propagation of event if onClick is not passed', () => {
    handleClickCommon(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalledTimes(0);
    expect(eventMock.stopPropagation).toHaveBeenCalledTimes(0);
    expect(onClickMock).toHaveBeenCalledTimes(0);
  });
});
