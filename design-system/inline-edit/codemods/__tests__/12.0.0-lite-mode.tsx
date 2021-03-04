import transformer from '../12.0.0-lite-mode';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

describe('apply all transforms', () => {
  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit, {InlineEditableTextfield} from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          validate={() => {}}
        />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    `
    /* TODO: (from codemod) We could not automatically convert this code to the new API.

    This file uses \`inline-edit\`’s \`validate\` prop which previously would use \`react-loadable\` and the \`inline-dialog\` packages. Version 12.0.0 of \`inline-edit\` now no longer includes these dependencies out of the box and instead allows you to compose your own experience.

    If you are using an editable textfield you can move over to the \`@atlaskit/inline-edit/inline-editable-textfield\` instead which comes with the previous error message behavior.

    To migrate you can use the \`isInvalid\` and \`errorMessage\` props passed to \`editView\`, like so:

    \`\`\`ts
    import InlineDialog from '@atlaskit/inline-dialog';
    import InlineEdit from '@atlaskit/inline-edit';

    const MyEditView = (
      <InlineEdit
        editView={({ errorMessage, isInvalid, ...props }) => (
          <InlineDialog content={errorMessage} isOpen={isInvalid}>
            <Textfield {...props} />
          </InlineDialog>
        )}
      />
    );
    \`\`\`
     */
    import React from "react";
    import InlineEditableTextfield from "@atlaskit/inline-edit/inline-editable-textfield";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <Container>
        <InlineEdit
          editView={(
            {
              errorMessage,
              ...fieldProps
            }
          ) => <Textfield {...fieldProps} autoFocus />}
          validate={() => {}}
        />
        <InlineEditableTextfield />
      </Container>
    );
    `,
    'should switch InlineEditableTextfield to a new entrypoint with default import',
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
              validate={() => {}}
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
    /* TODO: (from codemod) We could not automatically convert this code to the new API.

    This file uses \`inline-edit\`’s \`validate\` prop which previously would use \`react-loadable\` and the \`inline-dialog\` packages. Version 12.0.0 of \`inline-edit\` now no longer includes these dependencies out of the box and instead allows you to compose your own experience.

    If you are using an editable textfield you can move over to the \`@atlaskit/inline-edit/inline-editable-textfield\` instead which comes with the previous error message behavior.

    To migrate you can use the \`isInvalid\` and \`errorMessage\` props passed to \`editView\`, like so:

    \`\`\`ts
    import InlineDialog from '@atlaskit/inline-dialog';
    import InlineEdit from '@atlaskit/inline-edit';

    const MyEditView = (
      <InlineEdit
        editView={({ errorMessage, isInvalid, ...props }) => (
          <InlineDialog content={errorMessage} isOpen={isInvalid}>
            <Textfield {...props} />
          </InlineDialog>
        )}
      />
    );
    \`\`\`
     */
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
              validate={() => {}}
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
    'ColumnEditableTitle - add comment when editView is not inline and validate is passed',
  );

  defineInlineTest(
    { default: transformer, parser: 'tsx' },
    {},
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditOffsetContainer>
        <InlineEdit
            {...inlineEditProps}
            label={label}
            editButtonLabel={intl.formatMessage(
                inlineEditableMessages.editButtonLabel,
                i18nValues,
            )}
            confirmButtonLabel={intl.formatMessage(
                inlineEditableMessages.confirmButtonLabel,
                i18nValues,
            )}
            cancelButtonLabel={intl.formatMessage(
                inlineEditableMessages.cancelButtonLabel,
                i18nValues,
            )}
            isLabelHidden
            isFitContainerWidthReadView
            shouldConfirmOnEnter
            isWaiting={isWaiting}
            isInvalid={isInvalid}
            invalidMessage={invalidMessage}
            editView={
                // We forward props from Title to SingleLineTextInput
                // so the props InlineEdit injets are passed through.
                <TitleThatForwardsProps>
                    <SingleLineTextInput
                        isEditing
                        isInitiallySelected
                        style={inheritStyles}
                        onChange={(e) =>
                            inlineEditProps.onChange(e.target.value)
                        }
                        value={inlineEditProps.value}
                    />
                </TitleThatForwardsProps>
            }
            readView={
                // We forward props from Title to SingleLineTextInput
                // so the props InlineEdit injets are passed through.
                <TitleThatForwardsProps>
                    <SingleLineTextInput
                        style={inheritStyles}
                        isEditing={false}
                        value={children}
                    />
                </TitleThatForwardsProps>
            }
        />
      </InlineEditOffsetContainer>
    );
    `,
    `
    import React from "react";
    import InlineEdit from "@atlaskit/inline-edit";

    export default () => (
      <InlineEditOffsetContainer>
        <InlineEdit
            {...inlineEditProps}
            label={label}
            editButtonLabel={intl.formatMessage(
                inlineEditableMessages.editButtonLabel,
                i18nValues,
            )}
            confirmButtonLabel={intl.formatMessage(
                inlineEditableMessages.confirmButtonLabel,
                i18nValues,
            )}
            cancelButtonLabel={intl.formatMessage(
                inlineEditableMessages.cancelButtonLabel,
                i18nValues,
            )}
            isLabelHidden
            isFitContainerWidthReadView
            shouldConfirmOnEnter
            isWaiting={isWaiting}
            isInvalid={isInvalid}
            invalidMessage={invalidMessage}
            editView={
                // We forward props from Title to SingleLineTextInput
                // so the props InlineEdit injets are passed through.
                <TitleThatForwardsProps>
                    <SingleLineTextInput
                        isEditing
                        isInitiallySelected
                        style={inheritStyles}
                        onChange={(e) =>
                            inlineEditProps.onChange(e.target.value)
                        }
                        value={inlineEditProps.value}
                    />
                </TitleThatForwardsProps>
            }
            readView={
                // We forward props from Title to SingleLineTextInput
                // so the props InlineEdit injets are passed through.
                <TitleThatForwardsProps>
                    <SingleLineTextInput
                        style={inheritStyles}
                        isEditing={false}
                        value={children}
                    />
                </TitleThatForwardsProps>
            }
        />
      </InlineEditOffsetContainer>
    );
    `,
    'should do nothing for editView is something other than arrow function',
  );
});
