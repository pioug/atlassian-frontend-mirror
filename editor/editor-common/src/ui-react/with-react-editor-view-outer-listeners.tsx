import React, {
  ComponentClass,
  PureComponent,
  StatelessComponent,
} from 'react';

import { EditorView } from 'prosemirror-view';
import ReactDOM from 'react-dom';

import ReactEditorViewContext from './ReactEditorViewContext';

type SimpleEventHandler<T> = (event: T) => void;

// This needs exporting to be used alongisde `withReactEditorViewOuterListeners`
export interface WithOutsideClickProps {
  handleClickOutside?: SimpleEventHandler<MouseEvent>;
  handleEscapeKeydown?: SimpleEventHandler<KeyboardEvent>;
  handleEnterKeydown?: SimpleEventHandler<KeyboardEvent>;
}

class WithOutsideClick extends PureComponent<
  WithOutsideClickProps & {
    isActiveComponent: boolean;
    editorView?: EditorView;
    editorRef?: React.RefObject<HTMLDivElement>;
  },
  {}
> {
  componentDidMount() {
    if (this.props.handleClickOutside) {
      document.addEventListener('click', this.handleClick, false);
    }

    if (this.props.handleEscapeKeydown) {
      (this.props.editorRef?.current || document).addEventListener(
        'keydown',
        this.handleKeydown as any,
        false,
      );
    }
  }

  componentWillUnmount() {
    if (this.props.handleClickOutside) {
      document.removeEventListener('click', this.handleClick, false);
    }

    if (this.props.handleEscapeKeydown) {
      (this.props.editorRef?.current || document).removeEventListener(
        'keydown',
        this.handleKeydown as any,
        false,
      );
    }
  }

  handleClick = (evt: MouseEvent) => {
    if (!this.props.isActiveComponent) {
      return;
    }
    const domNode = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    if (
      !domNode ||
      (evt.target instanceof Node && !domNode.contains(evt.target))
    ) {
      if (this.props.handleClickOutside) {
        this.props.handleClickOutside(evt);
      }
    }
  };

  handleKeydown = (evt: KeyboardEvent) => {
    if (!this.props.isActiveComponent) {
      return;
    }
    if (evt.code === 'Escape' && this.props.handleEscapeKeydown) {
      evt.preventDefault();
      evt.stopPropagation();

      this.props.handleEscapeKeydown(evt);

      if (!this.props.editorView?.hasFocus()) {
        this.props.editorView?.focus();
      }

      return false;
    } else if (evt.code === 'Enter' && this.props.handleEnterKeydown) {
      this.props.handleEnterKeydown(evt);
    }
  };

  render() {
    return this.props.children;
  }
}

type HasIsOpen = {
  isOpen: boolean;
};

function hasIsOpen(props: any): props is HasIsOpen {
  return 'isOpen' in props;
}

export default function withReactEditorViewOuterListeners<P>(
  Component: ComponentClass<P> | StatelessComponent<P>,
): React.FC<P & WithOutsideClickProps> {
  return ({
    handleClickOutside,
    handleEnterKeydown,
    handleEscapeKeydown,
    ...props
  }) => {
    const isActiveComponent = hasIsOpen(props) ? props.isOpen : true;
    return (
      <ReactEditorViewContext.Consumer>
        {({ editorView, editorRef }) => (
          <WithOutsideClick
            editorView={editorView}
            editorRef={editorRef}
            isActiveComponent={isActiveComponent}
            handleClickOutside={handleClickOutside}
            handleEnterKeydown={handleEnterKeydown}
            handleEscapeKeydown={handleEscapeKeydown}
          >
            <Component {...(props as P)} />
          </WithOutsideClick>
        )}
      </ReactEditorViewContext.Consumer>
    );
  };
}
