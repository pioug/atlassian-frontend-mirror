import DefaultExport from '../..';
import EmojiPicker from '../../components/picker/EmojiPicker';

describe('@atlaskit/emoji', () => {
	describe('exports', () => {
		it('should not export a base component', () => {
			expect(DefaultExport).toEqual(EmojiPicker);
		});
	});
});
