import { loadResourceTags } from '../../src/common/utils';

describe('loadResourceTags', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('prepends tags', () => {
    document.head.append(document.createElement('link'));
    const testId = 'testid';
    loadResourceTags([`<script data-testid="${testId}"></script>`], true);
    const tag = <Element>document.head.childNodes[0];
    expect(tag.getAttribute('data-testid')).toEqual(testId);
  });

  it('appends tags', () => {
    document.head.append(document.createElement('link'));
    const testId = 'testid';
    loadResourceTags([`<script data-testid="${testId}"></script>`], false);
    const tag = <Element>document.head.childNodes[1];
    expect(tag.getAttribute('data-testid')).toEqual(testId);
  });

  it('does not duplicate tags', () => {
    const key = 'wrmkey';
    loadResourceTags([`<script data-wrm-key="${key}"></script>`], true);
    loadResourceTags([`<script data-wrm-key="${key}"></script>`], true);
    expect(document.head.childNodes.length).toEqual(1);
  });

  it('ignores undefined and null inputs', () => {
    loadResourceTags([undefined, null, undefined], true);
    expect(document.head.childNodes.length).toEqual(0);
  });
});
