/* eslint-disable no-undef, import/no-extraneous-dependencies */
import React from 'react';
import { shallow } from 'enzyme';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import HelpArticle from '../../components/HelpArticle';
import { ArticleContentTitleLink } from '../../components/styled';
import ArticleBody from '../../components/ArticleBody';

describe('HelpArticle', () => {
  const TITLE = 'title content';
  const BODY = 'body content';
  const TITLE_LINK_URL = 'https://atlaskit.atlassian.com/';

  describe('with defined Title', () => {
    it('should render title', () => {
      const helpArticle = shallow(<HelpArticle title={TITLE} />);
      const title = helpArticle.find('h2').first();
      expect(title.text()).toEqual(TITLE);
    });

    it('should render body inside iframe', () => {
      const helpArticle = shallow(<HelpArticle body={BODY} />);
      const articleBodyElm = helpArticle.find(ArticleBody);

      expect(articleBodyElm.length).toEqual(1);
      expect(articleBodyElm.prop('body')).toEqual(BODY);
    });

    it('should render title with link', () => {
      const helpArticle = shallow(
        <HelpArticle title={TITLE} titleLinkUrl={TITLE_LINK_URL} />,
      );

      const titleLink = helpArticle.find(ArticleContentTitleLink).first();
      expect(titleLink.find(ShortcutIcon).length).toEqual(1);
      expect(titleLink.prop('href')).toEqual(TITLE_LINK_URL);
      expect(titleLink.text()).toContain(TITLE);
    });
  });
});
