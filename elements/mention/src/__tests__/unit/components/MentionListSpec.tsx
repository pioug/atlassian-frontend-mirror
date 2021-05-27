import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { waitUntil } from '@atlaskit/elements-test-helpers';
import { mentionTestResult } from '@atlaskit/util-data-test/mention-test-data';
import { ReactWrapper } from 'enzyme';
import React from 'react';
import { InjectedIntlProps } from 'react-intl';
import MentionItem from '../../../components/MentionItem';
import MentionList, { Props, State } from '../../../components/MentionList';
import { isMentionItemSelected } from '../_test-helpers';

// TODO: After updating to expect.hasAssertions(), it identified some tests that are not correctly written.
// Please refer to: https://product-fabric.atlassian.net/browse/FS-4183
describe('MentionList', () => {
  describe('MentionList without initial element', () => {
    let component: ReactWrapper<Props & InjectedIntlProps, State>;
    let defaultMentionItemsShow: () => boolean;
    const setupList = (props?: Props) =>
      mountWithIntl<Props, State>(
        <MentionList mentions={mentionTestResult} {...props} />,
      );

    beforeEach(() => {
      component = setupList();
      defaultMentionItemsShow = () =>
        component.find(MentionItem).length === mentionTestResult.length;
    });

    afterEach(() => {
      component.unmount();
    });

    it('should have first item selected by default', () => {
      expect(component).toBeDefined();

      const firstItemSelected = () =>
        isMentionItemSelected(component, mentionTestResult[0].id);

      return waitUntil(defaultMentionItemsShow).then(() =>
        waitUntil(firstItemSelected),
      );
    });

    it('selectIndex selects correct item', () => {
      expect(component).toBeDefined();
      const thirdItemSelected = () => {
        return isMentionItemSelected(component, mentionTestResult[2].id);
      };

      return waitUntil(defaultMentionItemsShow).then(() => {
        const mentionList = component.instance() as MentionList;
        mentionList.selectIndex(2);
        component.update();
        return waitUntil(thirdItemSelected);
      });
    });

    it('selectId selects correct item', () => {
      expect(component).toBeDefined();
      const thirdItemSelected = () =>
        isMentionItemSelected(component, mentionTestResult[2].id);

      return waitUntil(defaultMentionItemsShow).then(() => {
        const mentionList = component.instance() as MentionList;
        mentionList.selectId(mentionTestResult[2].id);
        component.update();
        return waitUntil(thirdItemSelected);
      });
    });

    it('mentionsCount returns the number of mentions in the list', () => {
      expect(component).toBeDefined();
      return waitUntil(defaultMentionItemsShow).then(() => {
        const mentionList = component.instance() as MentionList;
        expect(mentionList.mentionsCount()).toEqual(mentionTestResult.length);
      });
    });

    it('should retain a deliberate selection across changing list of mentions', () => {
      expect(component).toBeDefined();
      return waitUntil(defaultMentionItemsShow).then(() => {
        const mentionList = component.instance() as MentionList;

        // select item 3 in the mention list
        mentionList.selectIndex(2);
        component.update();
        const thirdItemSelected = () =>
          isMentionItemSelected(component, mentionTestResult[2].id);

        return waitUntil(thirdItemSelected).then(() => {
          // remove the first item from the mentions array and set the new mentions
          const reducedMentionsList = mentionTestResult.slice(1);
          component.setProps({
            mentions: reducedMentionsList,
          });

          const reducedListOfItemsShow = () => {
            return (
              component.find(MentionItem).length === reducedMentionsList.length
            );
          };

          return waitUntil(reducedListOfItemsShow).then(() => {
            // ensure item 2 is now selected
            const secondItemSelected = () =>
              isMentionItemSelected(component, reducedMentionsList[1].id);
            component.update();
            return waitUntil(secondItemSelected);
          });
        });
      });
    });

    it('should select first item for each changing set of mentions if no deliberate selection is made', () => {
      expect(component).toBeDefined();
      return waitUntil(defaultMentionItemsShow).then(() => {
        const firstItemSelected = () =>
          isMentionItemSelected(component, mentionTestResult[0].id);
        return waitUntil(firstItemSelected).then(() => {
          // move the first item to the third position in a new list.
          // Note that I've also removed a single item from the list so I can differentiate when the new mentions are shown using length
          const reducedMentionsList = [
            ...mentionTestResult.slice(1, 3),
            mentionTestResult[0],
            ...mentionTestResult.slice(4),
          ];

          component.setProps({
            mentions: reducedMentionsList,
          });

          const reducedListOfItemsShow = () => {
            return (
              component.find(MentionItem).length === reducedMentionsList.length
            );
          };

          return waitUntil(reducedListOfItemsShow).then(() => {
            // ensure item 0 is still selected
            const newfirstItemSelected = () =>
              isMentionItemSelected(component, reducedMentionsList[0].id);
            return waitUntil(newfirstItemSelected);
          });
        });
      });
    });
  });

  describe('MentionList with initial highlight', () => {
    let component: ReactWrapper<Props & InjectedIntlProps, State>;
    let defaultMentionItemsShow: () => boolean;
    const HighlightItem = (
      <div id="highlight">Initial highlight information</div>
    );
    const setupList = (props?: Partial<Props>) =>
      mountWithIntl<Props, State>(
        <MentionList mentions={mentionTestResult} {...props} />,
      );

    beforeEach(() => {
      const props = {
        initialHighlightElement: HighlightItem,
      };
      component = setupList(props);
      defaultMentionItemsShow = () =>
        component.find(MentionItem).length === mentionTestResult.length;
    });

    afterEach(() => {
      component.unmount();
    });

    it('should have first item selected by default', () => {
      expect(component).toBeDefined();
      const firstItemSelected = () =>
        isMentionItemSelected(component, mentionTestResult[0].id);

      return waitUntil(defaultMentionItemsShow).then(() =>
        waitUntil(firstItemSelected),
      );
    });

    it('should render intitialHighlight', () => {
      expect(component).toBeDefined();
      const elementAppears = () => {
        return component.find('#highlight').length === 1;
      };
      return waitUntil(defaultMentionItemsShow).then(() =>
        waitUntil(elementAppears),
      );
    });
  });
});
