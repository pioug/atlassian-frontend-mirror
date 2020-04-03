import { name } from '../../../version.json';
import { mount } from 'enzyme';
import React from 'react';
import Editor from '../../../editor';
import CollapsedEditor from '../../../ui/CollapsedEditor';
import ChromeCollapsed from '../../../ui/ChromeCollapsed';

describe(name, () => {
  describe('CollapsedEditor', () => {
    it('should not render the editor when isExpanded is false', () => {
      const wrapper = mount(
        <CollapsedEditor isExpanded={false}>
          <Editor />
        </CollapsedEditor>,
      );
      expect(wrapper.find(Editor).exists()).toBe(false);
      expect(wrapper.find(ChromeCollapsed).exists()).toBe(true);
    });

    it('should render the editor when isExpanded is true', () => {
      const wrapper = mount(
        <CollapsedEditor isExpanded={true}>
          <Editor />
        </CollapsedEditor>,
      );
      expect(wrapper.find(Editor).exists()).toBe(true);
      expect(wrapper.find(ChromeCollapsed).exists()).toBe(false);
    });

    it('should call onFocus when collapsed editor is clicked', () => {
      const onFocus = jest.fn();
      const wrapper = mount(
        <CollapsedEditor onFocus={onFocus}>
          <Editor />
        </CollapsedEditor>,
      );
      wrapper.find(ChromeCollapsed).simulate('focus');
      expect(onFocus).toHaveBeenCalledTimes(1);
    });

    it('should not call onExpand when the editor is initially expanded', () => {
      const onExpand = jest.fn();
      mount(
        <CollapsedEditor isExpanded={true} onExpand={onExpand}>
          <Editor />
        </CollapsedEditor>,
      );
      expect(onExpand).toHaveBeenCalledTimes(0);
    });

    it('should call onExpand after the editor is expanded and mounted', () => {
      const onExpand = jest.fn();
      const wrapper = mount(
        <CollapsedEditor isExpanded={false} onExpand={onExpand}>
          <Editor />
        </CollapsedEditor>,
      );
      wrapper.setProps({ isExpanded: true });
      expect(onExpand).toHaveBeenCalledTimes(1);
    });

    it('should allow setting a ref on the editor component', () => {
      let editorRef = {};
      const setRef = (ref: Editor) => {
        editorRef = ref;
      };
      mount(
        <CollapsedEditor isExpanded={true}>
          <Editor ref={setRef} />
        </CollapsedEditor>,
      );
      expect(editorRef instanceof Editor).toBe(true);
    });
  });
});
