import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';

const render = (type: string) => (view: EditorView) => {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.zIndex = '99';
  div.style.background = 'black';
  div.style.color = 'white';
  div.dataset.type = type;
  return div;
};

export const exampleSelectionDebugger = () => {
  return {
    name: 'selection-debugger',
    pmPlugins() {
      return [
        {
          name: 'selection-debugger-main',
          plugin() {
            return new Plugin({
              props: {
                decorations: (state) =>
                  DecorationSet.create(state.doc, [
                    Decoration.widget(0, render('start')),
                    Decoration.widget(0, render('end')),
                  ]),
              },
              view(view) {
                return {
                  update() {
                    const start = view.dom.querySelector<HTMLElement>(
                      '[data-type="start"]',
                    );
                    const end = view.dom.querySelector<HTMLElement>(
                      '[data-type="end"]',
                    );

                    if (!start || !end) {
                      return;
                    }

                    const [startPos, endPos] = view.state.selection.empty
                      ? [view.coordsAtPos(view.state.selection.from)]
                      : [
                          view.coordsAtPos(view.state.selection.from),
                          view.coordsAtPos(view.state.selection.to),
                        ];

                    start.textContent = `${view.state.selection.from}`;
                    start.style.top = startPos.bottom + 'px';
                    start.style.left = startPos.left + 'px';

                    end.style.display = endPos !== undefined ? 'block' : 'none';
                    if (endPos !== undefined) {
                      end.textContent = `${view.state.selection.to}`;
                      end.style.top = endPos.bottom + 'px';
                      end.style.left = endPos.left + 'px';
                    }
                  },
                };
              },
            });
          },
        },
      ];
    },
  };
};
