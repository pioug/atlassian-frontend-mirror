/**
 *
 *
 * PLEASE DO NOT REMOVE THIS STORY
 * IT'S USED FOR developer.atlassian.com documentation playground
 *
 *
 */
import { ProviderFactory } from '@atlaskit/editor-common';
import { emoji } from '@atlaskit/util-data-test';
import Ajv from 'ajv';
import React from 'react';
import { ChangeEvent, PureComponent } from 'react';
import metaSchema from 'ajv/lib/refs/json-schema-draft-04.json';

import Renderer from '../src/ui/Renderer';

export interface State {
  value: string;
  validator?: (...args: any[]) => any;
  fetchingSchema: boolean;
  err?: Error;
}

const defaultDocument = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello world',
        },
      ],
    },
  ],
};

const providerFactory = ProviderFactory.create({
  emojiProvider: emoji.storyData.getEmojiResource(),
});

const ajv = new Ajv({
  schemaId: 'auto',
  meta: false, // optional, to prevent adding draft-06 meta-schema
  extendRefs: true, // optional, current default is to 'fail', spec behaviour is to 'ignore'
  unknownFormats: 'ignore', // optional, current default is true (fail)
});

ajv.addMetaSchema(metaSchema);
(ajv._opts as any).defaultMeta = metaSchema.id;

// optional, using unversioned URI is out of spec, see https://github.com/json-schema-org/json-schema-spec/issues/216
(ajv as any)['http://json-schema.org/schema'] =
  'http://json-schema.org/draft-04/schema';

// Optionally you can also disable keywords defined in draft-06
ajv.removeKeyword('propertyNames');
ajv.removeKeyword('contains');
ajv.removeKeyword('const');

export default class Example extends PureComponent<{}, State> {
  state: State = {
    value: JSON.stringify(defaultDocument, null, 2),
    fetchingSchema: false,
  };

  private onChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ value: evt.target.value });
  };

  private getRendererContent() {
    const { err, fetchingSchema, validator, value } = this.state;

    let json;
    let textMessage;

    try {
      json = JSON.parse(value);
    } catch (ex) {
      return <span>This is invalid JSON.</span>;
    }

    if (err) {
      textMessage = `Error occured while fetching the latest JSON schema for Atlassian Document Format: ${err.message}`;
    } else if (fetchingSchema) {
      textMessage =
        'Fetching latest JSON schema for Atlassian Document Format. Please wait...';
    } else if (validator && !validator(json)) {
      textMessage =
        'This JSON doesn\'t comply with Atlassian Document format. You can get the latest JSON schema <a href="http://go.atlassian.com/adf-json-schema">here</a>.';
    }

    if (textMessage) {
      return <span dangerouslySetInnerHTML={{ __html: textMessage }} />;
    }

    return <Renderer document={json} dataProviders={providerFactory} />;
  }

  componentDidMount() {
    this.setState({ fetchingSchema: true });

    fetch(
      'https://unpkg.com/@atlaskit/adf-schema@latest/dist/json-schema/v1/full.json',
    )
      .then(res => {
        return res.json();
      })
      .then(v1schema => {
        this.setState({
          fetchingSchema: false,
          validator: ajv.compile(v1schema),
        });
      })
      .catch(err => {
        this.setState({
          err,
          fetchingSchema: false,
        });
      });
  }

  render() {
    const renderedContent = this.getRendererContent();

    return (
      <div>
        <textarea
          style={{
            boxSizing: 'border-box',
            border: '1px solid lightgray',
            fontFamily: 'monospace',
            fontSize: 16,
            padding: 10,
            width: '100%',
            height: 320,
          }}
          ref="input"
          onChange={this.onChange}
          value={this.state.value}
        />
        <div style={{ margin: '6px 0', maxHeight: '300px', overflow: 'auto' }}>
          {renderedContent}
        </div>
      </div>
    );
  }
}
