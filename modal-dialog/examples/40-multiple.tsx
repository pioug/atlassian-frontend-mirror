import React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Lorem from 'react-lorem-component';
import Modal, { ModalTransition } from '../src';

const sizes = ['large', 'medium', 'small'];
interface State {
  openDialogs: string[];
}
export default class NestedDemo extends React.Component<{}, State> {
  state: State = { openDialogs: [] };

  open = (openDialogs: string) => {
    const openModals = this.state.openDialogs.slice(0);
    openModals.push(openDialogs);
    this.setState({ openDialogs: openModals });
  };

  close = () => {
    const openModals = this.state.openDialogs.slice(0);
    openModals.pop();
    this.setState({ openDialogs: openModals });
  };

  handleStackChange = (idx: number, name: string) => {
    console.info(`"${name}" stack change`, idx);
    console.log(`"${name}" stack change ${idx}`);
  };

  handleCloseComplete = () => {
    console.info(
      `The exit animation of the "${sizes[0]}" modal has completed.`,
    );
  };

  render() {
    const { openDialogs } = this.state;

    return (
      <div style={{ maxWidth: 400, padding: 16 }}>
        <ButtonGroup>
          {sizes.map(name => (
            <Button key={name} onClick={() => this.open(name)}>
              Open: {name}
            </Button>
          ))}
        </ButtonGroup>
        <p>
          For illustrative purposes three {'"stacked"'} modals can be opened in
          this demo, though ADG3 recommends only two at any time.
        </p>
        <p>
          Check the storybook{"'"}s {'"action logger"'} (or your console) to see
          how you can make use of the <code>onStackChange</code> property.
        </p>

        {sizes.map(name => {
          const next = sizes[sizes.indexOf(name) + 1];
          const onClick = next ? () => this.open(next) : () => {};
          const actions = [{ text: 'Close', onClick: this.close }];
          if (next) actions.push({ text: `Open: ${next}`, onClick });

          return (
            <ModalTransition key={name}>
              {openDialogs.includes(name) && (
                <Modal
                  actions={actions}
                  autoFocus
                  onClose={this.close}
                  onCloseComplete={next ? this.handleCloseComplete : undefined}
                  onStackChange={
                    next ? id => this.handleStackChange(id, name) : undefined
                  }
                  heading={`Modal: ${name}`}
                  width={name}
                >
                  <Lorem count={2} />
                </Modal>
              )}
            </ModalTransition>
          );
        })}
      </div>
    );
  }
}
