import { p, panel } from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { panelNodeView } from '../../../../../plugins/panel/nodeviews/panel';

describe('Panel - NodeView', () => {
  it('should render a contentDOM of `div` inside `div[data-panel-type]`', () => {
    const node = panel()(p('this is the decision'))(defaultSchema);

    const nodeView = panelNodeView()(node);

    const contentDOM = nodeView!.contentDOM as HTMLElement;

    expect(contentDOM.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.getAttribute('data-panel-type')).toBe(
      'info',
    );
  });
});
