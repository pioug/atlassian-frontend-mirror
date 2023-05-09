import { dropTargetForElements } from '../../../../src/entry-point/adapter/element';
import { dropTargetForFiles } from '../../../../src/entry-point/adapter/file';
import { getElements, reset } from '../../_util';

const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

beforeEach(async () => {
  warn.mockClear();
  await reset();
});

it('should warn if registering two drop targets of the same type on an element', () => {
  const [A] = getElements();

  const unbind1 = dropTargetForElements({
    element: A,
  });

  expect(warn).not.toHaveBeenCalled();

  const unbind2 = dropTargetForElements({
    element: A,
  });

  expect(warn).toHaveBeenCalled();

  unbind1();
  unbind2();
});

it('should not warn if registering two drop targets of different types on an element', () => {
  const [A] = getElements();

  const unbind1 = dropTargetForElements({
    element: A,
  });

  expect(warn).not.toHaveBeenCalled();

  const unbind2 = dropTargetForFiles({
    element: A,
  });

  expect(warn).not.toHaveBeenCalled();

  unbind1();
  unbind2();
});
