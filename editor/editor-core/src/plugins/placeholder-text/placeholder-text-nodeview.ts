import { NodeView, EditorView } from 'prosemirror-view';
import { DOMSerializer, Node as PmNode } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { getPosHandler } from '../../nodeviews';

type PmMutationRecord =
  | MutationRecord
  | {
      type: 'selection';
      target: Element;
    };

export class PlaceholderTextNodeView implements NodeView {
  public readonly dom: Node;

  public constructor(
    private readonly node: PmNode,
    private readonly view: EditorView,
    private readonly getPos: getPosHandler,
  ) {
    const serializer = DOMSerializer.fromSchema(this.view.state.schema);
    this.dom = serializer.serializeNode(this.node);
  }

  public ignoreMutation(record: PmMutationRecord) {
    // 😬
    // DOM Node needs to be contenteditable so Android does
    // not close its virtual keyboard, see ED-9613
    // To reestablish desired behaviour we replace the placeholdeer
    // when we detect a characterData mutation inside
    const { view, dom, node } = this;
    const content = dom.textContent || '';
    const text = node.attrs.text;

    if (
      record.type === 'characterData' &&
      content !== text &&
      content.includes(text) &&
      typeof this.getPos === 'function'
    ) {
      const start = this.getPos();
      const end = start + this.node.nodeSize;
      const stripped = content.replace(text, '');

      let tr = view.state.tr.replaceRangeWith(
        start,
        end,
        view.state.schema.text(stripped),
      );
      tr = tr.setSelection(TextSelection.create(tr.doc, end, end));

      view.dispatch(tr);
    }

    return record.type !== 'selection';
  }
}
