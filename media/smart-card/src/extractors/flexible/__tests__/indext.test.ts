import extractFlexibleUiContext from '../index';
import response from './__fixtures__/atlassian.project.json';

describe('extractFlexibleUiContext', () => {
  it('returns flexible ui context', () => {
    const data = extractFlexibleUiContext(response);

    expect(data).toEqual({
      title: 'Mars Mission',
    });
  });

  it('returns undefined if response is not provided', () => {
    const data = extractFlexibleUiContext();

    expect(data).toBeUndefined();
  });
});
