import DefaultExport from '../..';
import EmojiPicker from '../../components/picker/EmojiPicker';
import { name } from '../../version.json';

describe(name, () => {
  describe('exports', () => {
    it('should not export a base component', () => {
      expect(DefaultExport).toEqual(EmojiPicker);
    });
  });
});
