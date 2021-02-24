import { getBackground } from '../../utils';
import { background } from '@atlaskit/theme/colors';

const dark = background({ theme: { mode: 'dark' } });
const light = background({ theme: { mode: 'light ' } });

describe('getBackground', () => {
  it('should work with light theme', () => {
    expect(getBackground('light')).toEqual(light);
  });

  it('should work with dark theme', () => {
    expect(getBackground('dark')).toEqual(dark);
  });

  it('should work with no value', () => {
    expect(getBackground()).toEqual(light);
  });
});
