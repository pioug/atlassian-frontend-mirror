import React, { memo } from 'react';

import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
} from '@testing-library/react';

import Tabs, { Tab, TabList, TabPanel } from '../../index';
import { TabsProps } from '../../types';

declare var global: any;

afterEach(cleanup);

const renderTabs = (overridingProps: Partial<TabsProps> = {}) => (
  <Tabs id="test" {...overridingProps}>
    <TabList>
      <Tab>Tab 1 label</Tab>
      <Tab>Tab 2 label</Tab>
      <Tab>Tab 3 label</Tab>
    </TabList>
    <TabPanel>Tab 1 panel</TabPanel>
    <TabPanel>Tab 2 panel</TabPanel>
    <TabPanel>Tab 3 panel</TabPanel>
  </Tabs>
);

describe('@atlaskit/tabs', () => {
  describe('Tabs', () => {
    describe('rendering', () => {
      it('should not log console error on mount', () => {
        jest.spyOn(global.console, 'error');
        render(renderTabs());
        expect(global.console.error).not.toHaveBeenCalled();
        // @ts-ignore - Property 'mockRestore' does not exist
        global.console.error.mockRestore();
      });

      it('should render each tab', () => {
        const { getByText, getAllByRole } = render(renderTabs());
        expect(getAllByRole('tab').length).toBe(3);
        expect(getByText('Tab 1 label')).toBeTruthy();
        expect(getByText('Tab 2 label')).toBeTruthy();
        expect(getByText('Tab 3 label')).toBeTruthy();
      });

      it('should render one tab panel', () => {
        const { getByText, getAllByRole } = render(renderTabs());
        expect(getAllByRole('tabpanel').length).toBe(1);
        expect(getByText('Tab 1 label')).toBeTruthy();
      });
    });

    describe('content persisting', () => {
      it('should not unmount a panel when changed', () => {
        const { getByText, queryByText, getAllByRole } = render(renderTabs());

        getByText('Tab 2 label').click();

        expect(getAllByRole('tabpanel').length).toBe(2);
        expect(getByText('Tab 1 panel')).toBeTruthy();
        expect(getByText('Tab 2 panel')).toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();

        expect(getByText('Tab 1 panel').hidden).toBe(true);
        expect(getByText('Tab 2 panel').hidden).toBe(false);
      });

      it('should not unmount a panel when changed twice', () => {
        const { getByText, queryByText, getAllByRole } = render(renderTabs());

        getByText('Tab 2 label').click();
        getByText('Tab 1 label').click();

        expect(getAllByRole('tabpanel').length).toBe(2);
        expect(getByText('Tab 1 panel')).toBeTruthy();
        expect(getByText('Tab 2 panel')).toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();

        expect(getByText('Tab 1 panel').hidden).toBe(false);
        expect(getByText('Tab 2 panel').hidden).toBe(true);
      });

      it('should not unmount a panel when changed and another panel is added', () => {
        const { getByText, queryByText, getAllByRole, rerender } = render(
          renderTabs(),
        );

        getByText('Tab 2 label').click();
        getByText('Tab 1 label').click();

        rerender(
          <Tabs id="test">
            <TabList>
              <Tab>Tab 1 label</Tab>
              <Tab>Tab 2 label</Tab>
              <Tab>Tab 3 label</Tab>
              <Tab>Tab 4 label</Tab>
            </TabList>
            <TabPanel>Tab 1 panel</TabPanel>
            <TabPanel>Tab 2 panel</TabPanel>
            <TabPanel>Tab 3 panel</TabPanel>
            <TabPanel>Tab 4 panel</TabPanel>
          </Tabs>,
        );

        expect(getAllByRole('tabpanel').length).toBe(2);
        expect(getByText('Tab 1 panel')).toBeTruthy();
        expect(getByText('Tab 2 panel')).toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();
        expect(queryByText('Tab 4 panel')).not.toBeTruthy();

        expect(getByText('Tab 1 panel').hidden).toBe(false);
        expect(getByText('Tab 2 panel').hidden).toBe(true);
      });

      it('should not unmount a panel when changed and a panel is removed', () => {
        const { getByText, queryByText, getAllByRole, rerender } = render(
          renderTabs(),
        );

        getByText('Tab 2 label').click();
        getByText('Tab 1 label').click();

        rerender(
          <Tabs id="test">
            <TabList>
              <Tab>Tab 1 label</Tab>
              <Tab>Tab 2 label</Tab>
            </TabList>
            <TabPanel>Tab 1 panel</TabPanel>
            <TabPanel>Tab 2 panel</TabPanel>
          </Tabs>,
        );

        expect(getAllByRole('tabpanel').length).toBe(2);
        expect(getByText('Tab 1 panel')).toBeTruthy();
        expect(getByText('Tab 2 panel')).toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();

        expect(getByText('Tab 1 panel').hidden).toBe(false);
        expect(getByText('Tab 2 panel').hidden).toBe(true);
      });

      it('should unmount a panel when changed when shouldUnmountTabPanelOnChange=true', () => {
        const { getByText, queryByText, getAllByRole } = render(
          renderTabs({ shouldUnmountTabPanelOnChange: true }),
        );

        getByText('Tab 2 label').click();

        expect(getAllByRole('tabpanel').length).toBe(1);
        expect(queryByText('Tab 1 panel')).not.toBeTruthy();
        expect(getByText('Tab 2 panel')).toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();

        expect(getByText('Tab 2 panel').hidden).toBe(false);
      });

      it('should unmount a panel when changed twice when shouldUnmountTabPanelOnChange=true', () => {
        const { getByText, queryByText, getAllByRole } = render(
          renderTabs({ shouldUnmountTabPanelOnChange: true }),
        );

        getByText('Tab 2 label').click();
        getByText('Tab 1 label').click();

        expect(getAllByRole('tabpanel').length).toBe(1);
        expect(getByText('Tab 1 panel')).toBeTruthy();
        expect(queryByText('Tab 2 panel')).not.toBeTruthy();
        expect(queryByText('Tab 3 panel')).not.toBeTruthy();

        expect(getByText('Tab 1 panel').hidden).toBe(false);
      });
    });

    describe('props', () => {
      describe('defaultSelected', () => {
        it('should set the selected tab on initial mount', () => {
          const { getByText } = render(renderTabs({ defaultSelected: 1 }));
          expect(getByText('Tab 2 panel')).toBeTruthy();
        });

        it('changing this prop should not update the selected tab after the initial mount', () => {
          const { getByText, queryByText, rerender } = render(
            renderTabs({
              defaultSelected: 1,
            }),
          );

          rerender(
            renderTabs({
              defaultSelected: 2,
            }),
          );

          expect(getByText('Tab 2 panel')).toBeTruthy();
          expect(queryByText('Tab 3 panel')).not.toBeTruthy();
        });
      });

      describe('selected', () => {
        it('should set the selected tab on initial mount', () => {
          const { getByText } = render(renderTabs({ selected: 1 }));
          expect(
            getByText('Tab 2 label').getAttribute('aria-selected'),
          ).toBeTruthy();
          expect(getByText('Tab 2 panel')).toBeTruthy();
        });

        it('should take precedence over defaultSelected', () => {
          const { getByText } = render(
            renderTabs({ selected: 1, defaultSelected: 2 }),
          );
          expect(
            getByText('Tab 2 label').getAttribute('aria-selected'),
          ).toBeTruthy();
          expect(getByText('Tab 2 panel')).toBeTruthy();
        });

        it('changing this prop should update the selected tab after the initial mount', () => {
          const { getByText, rerender } = render(renderTabs({ selected: 1 }));

          rerender(renderTabs({ selected: 2 }));

          expect(
            getByText('Tab 3 label').getAttribute('aria-selected'),
          ).toBeTruthy();
          expect(getByText('Tab 3 panel')).toBeTruthy();
        });

        it('should default to the first tab if neither selected nor defaultSelected are set', () => {
          const { getByText } = render(renderTabs());
          expect(
            getByText('Tab 1 label').getAttribute('aria-selected'),
          ).toBeTruthy();
          expect(getByText('Tab 1 panel')).toBeTruthy();
        });

        describe("setting this prop should make the component 'controlled'", () => {
          it('should listen to selected prop if defined', () => {
            const { getByText } = render(renderTabs({ selected: 1 }));
            getByText('Tab 1 label').click();

            expect(
              getByText('Tab 2 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(getByText('Tab 2 panel')).toBeTruthy();
          });

          it('should maintain its own internal state in case selected is not provided', () => {
            const { getByText, rerender } = render(renderTabs({ selected: 1 }));
            getByText('Tab 1 label').click();

            rerender(renderTabs());

            expect(
              getByText('Tab 1 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(getByText('Tab 1 panel')).toBeTruthy();
          });
        });
      });
      describe('onChange', () => {
        it('is not fired if changed by prop', () => {
          const spy = jest.fn();
          const { rerender } = render(
            renderTabs({ selected: 0, onChange: spy }),
          );
          rerender(renderTabs({ selected: 1, onChange: spy }));
          expect(spy).not.toHaveBeenCalled();
        });

        it('is fired with the selected tab and its index when selected by click', () => {
          const spy = jest.fn();
          const { getByText } = render(renderTabs({ onChange: spy }));

          getByText('Tab 2 label').click();

          // Don't care about second argument because tested in analytics
          expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
        });

        it('is fired with the selected tab and its index when selected by keyboard', () => {
          const spy = jest.fn();
          const { getByText } = render(renderTabs({ onChange: spy }));

          const tab1 = getByText('Tab 1 label');

          fireEvent.keyDown(tab1, { key: 'ArrowRight' });

          expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
        });
      });
      describe('id', () => {
        it('maps id correctly', () => {
          const { getByText } = render(renderTabs());

          expect(getByText('Tab 1 label').id).toBe('test-0');
          expect(getByText('Tab 2 label').id).toBe('test-1');
          expect(getByText('Tab 3 label').id).toBe('test-2');
          expect(getByText('Tab 1 panel').id).toBe('test-0-tab');
        });
      });
    });

    describe('behaviour', () => {
      describe('keyboard navigation', () => {
        describe('with 3 tabs, when the 2nd tab is selected', () => {
          let wrapper: RenderResult;
          let onChange: jest.Mock;

          beforeEach(() => {
            onChange = jest.fn();
            wrapper = render(renderTabs({ defaultSelected: 1, onChange }));
            expect(
              wrapper.getByText('Tab 2 label').getAttribute('aria-selected'),
            ).toBe('true');
            expect(wrapper.getByText('Tab 2 panel')).toBeTruthy();
          });
          afterEach(() => {
            wrapper.unmount();
          });

          const simulateKeyboardNav = (index: number, key: string) => {
            const tab = wrapper.getByText(`Tab ${index} label`);
            fireEvent.keyDown(tab, { key });
          };

          it('pressing LEFT arrow selects the first tab', () => {
            simulateKeyboardNav(2, 'ArrowLeft');

            expect(
              wrapper.getByText('Tab 1 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 1 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(
              0,
              expect.objectContaining({}),
            );
          });

          it('pressing the RIGHT arrow selects the last tab', () => {
            simulateKeyboardNav(2, 'ArrowRight');

            expect(
              wrapper.getByText('Tab 3 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 3 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(
              2,
              expect.objectContaining({}),
            );
          });

          it('pressing the LEFT arrow twice selects the last tab', () => {
            simulateKeyboardNav(2, 'ArrowLeft');
            simulateKeyboardNav(1, 'ArrowLeft');

            expect(
              wrapper.getByText('Tab 3 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 3 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(
              0,
              expect.objectContaining({}),
            );
          });

          it('pressing the RIGHT arrow twice selects the first tab', () => {
            simulateKeyboardNav(2, 'ArrowRight');
            simulateKeyboardNav(3, 'ArrowRight');

            expect(
              wrapper.getByText('Tab 1 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 1 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(
              2,
              expect.objectContaining({}),
            );
          });

          it('pressing the HOME key selects the first tab', () => {
            simulateKeyboardNav(2, 'Home');

            expect(
              wrapper.getByText('Tab 1 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 1 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(
              0,
              expect.objectContaining({}),
            );
          });

          it('pressing the END key selects the last tab', () => {
            simulateKeyboardNav(2, 'End');

            expect(
              wrapper.getByText('Tab 3 label').getAttribute('aria-selected'),
            ).toBeTruthy();
            expect(wrapper.getByText('Tab 3 panel')).toBeTruthy();
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(
              2,
              expect.objectContaining({}),
            );
          });
        });
      });

      it('tab panels that are memoized should not rerender if something changes', () => {
        let renderCount = 0;
        const Panel = memo(({ text }: { text: string }) => {
          renderCount++;
          return <span>{text}</span>;
        });

        const { rerender } = render(
          <Tabs id="test">
            <TabList>
              <Tab>Tab 1 label</Tab>
            </TabList>
            <TabPanel>
              <Panel text="Tab 1 panel" />
            </TabPanel>
          </Tabs>,
        );

        rerender(
          <Tabs id="test">
            <TabList>
              <Tab>Tab 1 label</Tab>
            </TabList>
            <TabPanel>
              <Panel text="Tab 1 panel" />
            </TabPanel>
          </Tabs>,
        );

        expect(renderCount).toBe(1);
      });

      it('should function correctly if components are wrapped in divs', () => {
        const spy = jest.fn();
        const { getByText } = render(
          <Tabs onChange={spy} id="test">
            <div>
              <TabList>
                <div>
                  <Tab>Tab 1 label</Tab>
                </div>
                <div>
                  <Tab>Tab 2 label</Tab>
                </div>
                <div>
                  <Tab>Tab 3 label</Tab>
                </div>
              </TabList>
            </div>
            <div>
              <TabPanel>Tab 1 panel</TabPanel>
            </div>
            <div>
              <TabPanel>Tab 2 panel</TabPanel>
            </div>
            <div>
              <TabPanel>Tab 3 panel</TabPanel>
            </div>
          </Tabs>,
        );

        getByText('Tab 2 label').click();

        // Don't care about second argument because tested in analytics
        expect(spy).toHaveBeenCalledWith(1, expect.objectContaining({}));
        expect(getByText('Tab 2 panel')).toBeTruthy();
      });
    });
  });
});
