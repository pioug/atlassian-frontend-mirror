import React from 'react';
import styled from 'styled-components';
import { N30, N10 } from '@atlaskit/theme/colors';

import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';

import { ExampleEditor, LOCALSTORAGE_defaultDocKey } from './5-full-page';

import decisionAdf from '../example-helpers/templates/decision.adf.json';
import breakoutAdf from '../example-helpers/templates/breakout.adf.json';
import { EditorActions, ContextPanel } from '../src';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';

const isEmptyDoc = (adf: any) => adf.content.length === 0;

type TemplateDefinition = {
  title: string;
  desc: string;
  adf: any;
};

const templates: Array<TemplateDefinition> = new Array(20).fill({
  title: 'Decision',
  desc:
    'Use this template to effectively guide your team in making a descision.',
  adf: decisionAdf,
});

templates[1] = {
  title: 'Breakout',
  desc: `This is an example template that has breakout content so that you can
         ensure everything is working correctly when the sidebar is overlaid.`,
  adf: breakoutAdf,
};

const TemplateCard = styled.div`
  border: 1px solid ${N30};
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 5px;

  &:hover {
    background: ${N10};
  }
`;

// when loading a document on a small viewport, the tables plugin resizes
// the column widths. this causes the editor's ADF to diverge from the
// ADF of the template.
//
// normalises column widths between documents by clearing them.
const clearTableWidths = (adf: any) => {
  if (!adf.content) {
    // leaf node
    return adf;
  }

  // recursively fix children
  adf.content = adf.content.map((child: any) => {
    if (child.type === 'tableCell' || child.type === 'tableHeader') {
      child.attrs.colwidth = [];
    }

    if (child.content) {
      return clearTableWidths(child);
    } else {
      return child;
    }
  });

  return adf;
};

type TemplatePanelState = {
  selectedTemplate: TemplateDefinition | null;
  adf: any;
};

class TemplatePanel extends React.Component<
  {
    actions: EditorActions;
    defaultValue: string | undefined;
  },
  TemplatePanelState
> {
  state: TemplatePanelState = {
    selectedTemplate: null,
    adf: null,
  };

  onChange = async () => {
    const actions = this.props.actions;
    const adf = await actions.getValue();

    this.setState((state) => ({
      ...state,

      adf,

      // reset selected template if document is cleared
      selectedTemplate: isEmptyDoc(adf) ? null : this.state.selectedTemplate,
    }));
  };

  selectTemplate(tmpl: TemplateDefinition) {
    this.setState({
      selectedTemplate: tmpl,
    });

    this.props.actions.replaceDocument(tmpl.adf, false);
  }

  render() {
    return (
      <ContextPanel visible={true}>
        <div>
          {templates.map((tmpl, idx) => (
            <TemplateCard key={idx} onClick={() => this.selectTemplate(tmpl)}>
              <h4>{tmpl.title}</h4>
              <p>{tmpl.desc}</p>
            </TemplateCard>
          ))}
        </div>
      </ContextPanel>
    );
  }
}

class EditorWithSidebar extends React.Component {
  sidebar = React.createRef<TemplatePanel>();

  // wire this up via ref so that we don't re-render the whole
  // editor each time the content changes, only the sidebar
  onChange = async () => {
    if (this.sidebar.current) {
      this.sidebar.current.onChange();
    }
  };

  render() {
    const defaultValue =
      (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
      undefined;

    return (
      <ExampleEditor
        onChange={this.onChange}
        defaultValue={defaultValue}
        extensionProviders={(editorActions) => [
          getExampleExtensionProviders(editorActions),
        ]}
        allowExtension={{ allowAutoSave: true }}
        contextPanel={
          <WithEditorActions
            render={(actions) => (
              <TemplatePanel
                actions={actions}
                defaultValue={defaultValue ? JSON.parse(defaultValue) : null}
                ref={this.sidebar}
              />
            )}
          />
        }
      />
    );
  }
}

export default function Example() {
  return (
    <EditorContext>
      <EditorWithSidebar />
    </EditorContext>
  );
}
