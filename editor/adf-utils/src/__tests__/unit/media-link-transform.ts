import { transformMediaLinkMarks } from '../../transforms/media-link-transform';
import mediaAdf from './__fixtures__/mediaSingle-adf.json';

describe('Media-link-transform', () => {
  it('should move the link mark from mediaSingle to media', () => {
    expect(transformMediaLinkMarks(mediaAdf)).toMatchSnapshot();
  });
});
