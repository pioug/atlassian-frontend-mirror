import { decisionItem } from '@atlaskit/editor-test-helpers/schema-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import { decisionItemNodeView } from '../../../../../plugins/tasks-and-decisions/nodeviews/decisionItem';

describe('Decision Item - NodeView', () => {
  const portalProviderAPI = { render() {}, remove() {} } as any;

  it('should render a contentDOM of `div` inside `li`', () => {
    const node = decisionItem()('this is the decision')(defaultSchema);

    const nodeView = decisionItemNodeView(portalProviderAPI)(
      node,
      null as any,
      () => -1,
    );

    const contentDOM = nodeView!.contentDOM as HTMLElement;

    expect(contentDOM.tagName).toBe('DIV');
    expect(contentDOM.parentElement!.tagName).toBe('LI');
  });
});
