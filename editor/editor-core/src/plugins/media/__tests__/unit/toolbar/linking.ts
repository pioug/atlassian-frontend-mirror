import { buildLinkingButtons } from '../../../toolbar/linking';
import { IntlProvider } from 'react-intl';

jest.mock('../../../pm-plugins/linking', () => ({
  ...jest.requireActual('../../../pm-plugins/linking'),
  getMediaLinkingState: jest.fn(({ link }) => {
    return {
      editable: true,
      link: link,
    };
  }),
}));

describe('linking', () => {
  describe('#buildLinkingButtons', () => {
    const intlProvider = new IntlProvider({
      locale: 'en',
    });
    const intl = intlProvider.getChildContext().intl;

    it('enable the link button when link is safe', () => {
      const items = buildLinkingButtons(
        { link: 'http://www.google.com' } as any,
        intl,
      );
      const linkItem: any = items.find(
        (item: any) => item.className === 'hyperlink-open-link',
      );
      expect(linkItem.disabled).toEqual(false);
      expect(linkItem.title).toEqual('Open link in a new tab');
      expect(linkItem.href).toEqual('http://www.google.com');
    });

    it('disable the link button when link is unsafe', () => {
      const items = buildLinkingButtons(
        { link: 'javascript://alert("hack")' } as any,
        intl,
      );
      const linkItem: any = items.find(
        (item: any) => item.className === 'hyperlink-open-link',
      );
      expect(linkItem.disabled).toEqual(true);
      expect(linkItem.title).toEqual('Unable to open this link');
      expect(linkItem.href).toEqual(undefined);
    });
  });
});
