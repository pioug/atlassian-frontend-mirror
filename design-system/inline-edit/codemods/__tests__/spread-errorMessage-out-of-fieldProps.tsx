import { createTransformer } from '@atlaskit/codemod-utils';

import spreadErrorMessage from '../migrates/spread-errorMessage-out-of-fieldProps';

const transformer = createTransformer([spreadErrorMessage]);

jest.autoMockOff();
const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('spreadErrorMessage prop', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        validate={()=>{}}
        editView={(fieldProps) => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        validate={()=>{}}
        editView={(
          {
            errorMessage,
            ...fieldProps
          }
        ) => <Textfield {...fieldProps} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    'should spread errorMessage out',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        validate={()=>{}}
        editView={props => <Textfield {...props} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEdit
        defaultValue={editValue}
        label="Inline edit"
        validate={()=>{}}
        editView={(
          {
            errorMessage,
            ...props
          }
        ) => <Textfield {...props} autoFocus />}
        readView={() => (
          <ReadViewContainer data-testid="read-view">
            {editValue || 'Click to enter value'}
          </ReadViewContainer>
        )}
        onConfirm={value => setEditValue(value)}
      />
    );
    `,
    'should spread errorMessage out - with alias',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { PureComponent } from "react";
    import InlineEdit from "@atlaskit/inline-edit";
    import TextField from "@atlaskit/textfield";

    export default class ColumnEditableTitle extends PureComponent {
      handleChange = (event) => {
        this.setState({ editValue: event.target.value });
      };

      handleEditChange = () => {
        this.setState({ isEditing: true });
        if (this.props.onEditChange) {
          this.props.onEditChange(true);
        }
      };

      handleConfirm = () => {
        const newValue = this.state.editValue.trim();

        if (isBlank(newValue) || hasNotChange(newValue, this.props.text)) {
          this.handleCancel();
        } else {
          this.setState({ isEditing: false });
          this.props.onConfirm(this.props.columnId, newValue);
          if (this.props.onEditChange) {
            this.props.onEditChange(false);
          }
        }
      };

      handleCancel = () => {
        this.setState({
          editValue: this.props.text,
          isEditing: false,
        });
        this.props.onCancel(this.props.columnId);
        if (isNotNewColumn(this.props) && this.props.onEditChange) {
          this.props.onEditChange(false);
        }
      };

      handleKeyDown = (event) => {
        if (isEscape(event)) {
          this.handleCancel();
        }
      };

      renderReading = () => (
        <Reading>
          <ColumnTitle {...this.props} text={this.state.editValue} />
        </Reading>
      );

      renderEditing = (fieldProps) => (
        <TextField
          {...fieldProps}
          autoFocus
          value={this.state.editValue}
          onChange={this.handleChange}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={this.handleKeyDown}
          isCompact
        />
      );

      render() {
        const { isDisabled } = this.props;

        // if this component is disabled or in case this component belongs to a
        // new column (id < 0) and is no longer being edited then <ColumnTitle/>
        // should be rendered instead (not in editable mode).
        const shouldRenderColumnTitle =
          isDisabled || (isNewColumn(this.props) && !this.state.isEditing);

        return shouldRenderColumnTitle ? (
          <ColumnTitle {...this.props} text={this.state.editValue} />
        ) : (
          <Container>
            <InlineEdit
              defaultValue={this.state.editValue}
              startWithEditViewOpen
              editView={this.renderEditing}
              readView={this.renderReading}
              onConfirm={this.handleConfirm}
              // OnCancel will be exposed back once https://product-fabric.atlassian.net/browse/DST-1865 is released
              onCancel={this.handleCancel}
            />
          </Container>
        );
      }
    }
    `,
    `
    import React, { PureComponent } from "react";
    import InlineEdit from "@atlaskit/inline-edit";
    import TextField from "@atlaskit/textfield";

    export default class ColumnEditableTitle extends PureComponent {
      handleChange = (event) => {
        this.setState({ editValue: event.target.value });
      };

      handleEditChange = () => {
        this.setState({ isEditing: true });
        if (this.props.onEditChange) {
          this.props.onEditChange(true);
        }
      };

      handleConfirm = () => {
        const newValue = this.state.editValue.trim();

        if (isBlank(newValue) || hasNotChange(newValue, this.props.text)) {
          this.handleCancel();
        } else {
          this.setState({ isEditing: false });
          this.props.onConfirm(this.props.columnId, newValue);
          if (this.props.onEditChange) {
            this.props.onEditChange(false);
          }
        }
      };

      handleCancel = () => {
        this.setState({
          editValue: this.props.text,
          isEditing: false,
        });
        this.props.onCancel(this.props.columnId);
        if (isNotNewColumn(this.props) && this.props.onEditChange) {
          this.props.onEditChange(false);
        }
      };

      handleKeyDown = (event) => {
        if (isEscape(event)) {
          this.handleCancel();
        }
      };

      renderReading = () => (
        <Reading>
          <ColumnTitle {...this.props} text={this.state.editValue} />
        </Reading>
      );

      renderEditing = (fieldProps) => (
        <TextField
          {...fieldProps}
          autoFocus
          value={this.state.editValue}
          onChange={this.handleChange}
          onMouseDown={(event) => event.stopPropagation()}
          onKeyDown={this.handleKeyDown}
          isCompact
        />
      );

      render() {
        const { isDisabled } = this.props;

        // if this component is disabled or in case this component belongs to a
        // new column (id < 0) and is no longer being edited then <ColumnTitle/>
        // should be rendered instead (not in editable mode).
        const shouldRenderColumnTitle =
          isDisabled || (isNewColumn(this.props) && !this.state.isEditing);

        return shouldRenderColumnTitle ? (
          <ColumnTitle {...this.props} text={this.state.editValue} />
        ) : (
          <Container>
            <InlineEdit
              defaultValue={this.state.editValue}
              startWithEditViewOpen
              editView={this.renderEditing}
              readView={this.renderReading}
              onConfirm={this.handleConfirm}
              // OnCancel will be exposed back once https://product-fabric.atlassian.net/browse/DST-1865 is released
              onCancel={this.handleCancel}
            />
          </Container>
        );
      }
    }
    `,
    'ColumnEditableTitle - add comment when editView is not inline',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React, { PureComponent } from "react";
    import InlineEdit from "@atlaskit/inline-edit";
    import TextField from "@atlaskit/textfield";

    export default class ColumnEditableTitle extends PureComponent {
      handleChange = (event) => {
        this.setState({ editValue: event.target.value });
      };

      handleEditChange = () => {
        this.setState({ isEditing: true });
        if (this.props.onEditChange) {
          this.props.onEditChange(true);
        }
      };

      handleConfirm = () => {
        const newValue = this.state.editValue.trim();

        if (isBlank(newValue) || hasNotChange(newValue, this.props.text)) {
          this.handleCancel();
        } else {
          this.setState({ isEditing: false });
          this.props.onConfirm(this.props.columnId, newValue);
          if (this.props.onEditChange) {
            this.props.onEditChange(false);
          }
        }
      };

      handleCancel = () => {
        this.setState({
          editValue: this.props.text,
          isEditing: false,
        });
        this.props.onCancel(this.props.columnId);
        if (isNotNewColumn(this.props) && this.props.onEditChange) {
          this.props.onEditChange(false);
        }
      };

      handleKeyDown = (event) => {
        if (isEscape(event)) {
          this.handleCancel();
        }
      };

      renderReading = () => (
        <Reading>
          <ColumnTitle {...this.props} text={this.state.editValue} />
        </Reading>
      );

      render() {
        const { isDisabled } = this.props;

        // if this component is disabled or in case this component belongs to a
        // new column (id < 0) and is no longer being edited then <ColumnTitle/>
        // should be rendered instead (not in editable mode).
        const shouldRenderColumnTitle =
          isDisabled || (isNewColumn(this.props) && !this.state.isEditing);

        return shouldRenderColumnTitle ? (
          <ColumnTitle {...this.props} text={this.state.editValue} />
        ) : (
          <Container>
            <InlineEdit
              defaultValue={this.state.editValue}
              startWithEditViewOpen
              validate={() => {}}
              editView={(fieldProps) => (
                <TextField
                  {...fieldProps}
                  autoFocus
                  value={this.state.editValue}
                  onChange={this.handleChange}
                  onMouseDown={(event) => event.stopPropagation()}
                  onKeyDown={this.handleKeyDown}
                  isCompact
                />
              )}
              readView={this.renderReading}
              onConfirm={this.handleConfirm}
              // OnCancel will be exposed back once https://product-fabric.atlassian.net/browse/DST-1865 is released
              onCancel={this.handleCancel}
            />
          </Container>
        );
      }
    }
    `,
    `
    import React, { PureComponent } from "react";
    import InlineEdit from "@atlaskit/inline-edit";
    import TextField from "@atlaskit/textfield";

    export default class ColumnEditableTitle extends PureComponent {
      handleChange = (event) => {
        this.setState({ editValue: event.target.value });
      };

      handleEditChange = () => {
        this.setState({ isEditing: true });
        if (this.props.onEditChange) {
          this.props.onEditChange(true);
        }
      };

      handleConfirm = () => {
        const newValue = this.state.editValue.trim();

        if (isBlank(newValue) || hasNotChange(newValue, this.props.text)) {
          this.handleCancel();
        } else {
          this.setState({ isEditing: false });
          this.props.onConfirm(this.props.columnId, newValue);
          if (this.props.onEditChange) {
            this.props.onEditChange(false);
          }
        }
      };

      handleCancel = () => {
        this.setState({
          editValue: this.props.text,
          isEditing: false,
        });
        this.props.onCancel(this.props.columnId);
        if (isNotNewColumn(this.props) && this.props.onEditChange) {
          this.props.onEditChange(false);
        }
      };

      handleKeyDown = (event) => {
        if (isEscape(event)) {
          this.handleCancel();
        }
      };

      renderReading = () => (
        <Reading>
          <ColumnTitle {...this.props} text={this.state.editValue} />
        </Reading>
      );

      render() {
        const { isDisabled } = this.props;

        // if this component is disabled or in case this component belongs to a
        // new column (id < 0) and is no longer being edited then <ColumnTitle/>
        // should be rendered instead (not in editable mode).
        const shouldRenderColumnTitle =
          isDisabled || (isNewColumn(this.props) && !this.state.isEditing);

        return shouldRenderColumnTitle ? (
          <ColumnTitle {...this.props} text={this.state.editValue} />
        ) : (
          <Container>
            <InlineEdit
              defaultValue={this.state.editValue}
              startWithEditViewOpen
              validate={() => {}}
              editView={(
                {
                  errorMessage,
                  ...fieldProps
                }
              ) => <TextField
                {...fieldProps}
                autoFocus
                value={this.state.editValue}
                onChange={this.handleChange}
                onMouseDown={(event) => event.stopPropagation()}
                onKeyDown={this.handleKeyDown}
                isCompact
              />}
              readView={this.renderReading}
              onConfirm={this.handleConfirm}
              // OnCancel will be exposed back once https://product-fabric.atlassian.net/browse/DST-1865 is released
              onCancel={this.handleCancel}
            />
          </Container>
        );
      }
    }
    `,
    'ColumnEditableTitle - convert when editView is inline',
  );
});
