jest.autoMockOff();

import transformer from '../not-yet-migrate-to-simplified-form';

const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`import React from 'react';`,
	`import React from 'react';`,
	'should not transform if imports are not present',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`
    import React from 'react';
    import { Field } from '@atlaskit/form';

    const Component1 = () => <Field />;

    const Component2 = () => <><Field /></>;

    class Component3 extends React.Component { render() { return <Field />; } }

    const element = <Field />;
    `,
	`
    import React from 'react';
    import { Field } from '@atlaskit/form';

    const Component1 = () => <Field />;

    const Component2 = () => <><Field /></>;

    class Component3 extends React.Component { render() { return <Field />; } }

    const element = <Field />;
    `,
	'should not transform if default import is not preset',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`
    import React from 'react';
    import Form from '@atlaskit/form';

    const Component1 = () => <Form />;

    const Component2 = () => <><Form /></>;

    class Component3 extends React.Component { render() { return <Form />; } }

    const element = <Form />;
    `,
	`
    import React from 'react';
    import Form from '@atlaskit/form';

    const Component1 = () => <Form />;

    const Component2 = () => <><Form /></>;

    class Component3 extends React.Component { render() { return <Form />; } }

    const element = <Form />;
    `,
	'should not transform if children are not preset',
);

defineInlineTest(
	{ default: transformer, parser: 'tsx' },
	{},
	`
    import React from 'react';
    import Form from '@atlaskit/code';

    const Component1 = () => (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );

    const Component2 = () => (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );

    class Component3 extends React.Component {
      render() {
        return (
          <Form onSubmit={() => {}}>
            <p>Test</p>
          </Form>
        );
      }
    }

    const element = (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );
  `,
	`
    import React from 'react';
    import Form from '@atlaskit/code';

    const Component1 = () => (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );

    const Component2 = () => (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );

    class Component3 extends React.Component {
      render() {
        return (
          <Form onSubmit={() => {}}>
            <p>Test</p>
          </Form>
        );
      }
    }

    const element = (
      <Form onSubmit={() => {}}>
        <p>Test</p>
      </Form>
    );
  `,
	'should not transform if children is not a function',
);

describe('Migrate <Form> to simplified version if only `formProps` in child arg ', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps}>
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps}>
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps}>
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (<Form onSubmit={() => {}}><input /></Form>);
  }
}

const formElement = (
  <Form onSubmit={() => {}}><input /></Form>
);
      `,
		'should convert from function with no props on form',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps: renamed }) => (
      <form {...renamed}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps: renamed }) => (
        <form {...renamed}>
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps: renamed }) => (
          <form {...renamed}>
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps: renamed }) => (
      <form {...renamed}>
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (<Form onSubmit={() => {}}><input /></Form>);
  }
}

const formElement = (
  <Form onSubmit={() => {}}><input /></Form>
);
      `,
		'should convert from function with no props on form',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar">
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} foo="bar">
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar"
      }}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form
        onSubmit={() => {}}
        formProps={{
          foo: "bar"
        }}><input /></Form>
    );
  }
}

const formElement = (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form>
);
      `,
		'should convert from function with single prop on form',
	);

	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar" baz="qux">
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} foo="bar" baz="qux">
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar",
      baz: "qux"
    }}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar",
        baz: "qux"
      }}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form
        onSubmit={() => {}}
        formProps={{
          foo: "bar",
          baz: "qux"
        }}><input /></Form>
    );
  }
}

const formElement = (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar",
      baz: "qux"
    }}><input /></Form>
);
      `,
		'should convert from function with multiple props on form',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: 'bar',
      baz: { qux: 'qux' }
    }}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form
      onSubmit={() => {}}
      formProps={{
        foo: 'bar',
        baz: { qux: 'qux' }
      }}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form
        onSubmit={() => {}}
        formProps={{
          foo: 'bar',
          baz: { qux: 'qux' }
        }}><input /></Form>
    );
  }
}

const formElement = (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: 'bar',
      baz: { qux: 'qux' }
    }}><input /></Form>
);
      `,
		'should convert from function with multiple expression container props on form',
	);
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo>
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} foo>
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo>
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: true
    }}><input /></Form>
);

const FormComponent2 = () => (
  <>
    <Form
      onSubmit={() => {}}
      formProps={{
        foo: true
      }}><input /></Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form
        onSubmit={() => {}}
        formProps={{
          foo: true
        }}><input /></Form>
    );
  }
}

const formElement = (
  <Form
    onSubmit={() => {}}
    formProps={{
      foo: true
    }}><input /></Form>
);
      `,
		'should convert from function with boolean props on form',
	);
});

describe('Do not migrate Form when anything more than `formProps` in child arg', () => {
	defineInlineTest(
		{ default: transformer, parser: 'tsx' },
		{},
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps, submitting }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps, submitting }) => (
        <form {...formProps} foo="bar" baz="qux">
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps, submitting }) => (
          <form {...formProps} foo="bar" baz="qux">
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps, submitting }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);
      `,
		`
import React from 'react';
import Form from '@atlaskit/form';

const FormComponent1 = () => (
  <Form onSubmit={() => {}}>
    {({ formProps, submitting }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    <Form onSubmit={() => {}}>
      {({ formProps, submitting }) => (
        <form {...formProps} foo="bar" baz="qux">
          <input />
        </form>
      )}
    </Form>
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return (
      <Form onSubmit={() => {}}>
        {({ formProps, submitting }) => (
          <form {...formProps} foo="bar" baz="qux">
            <input />
          </form>
        )}
      </Form>
    );
  }
}

const formElement = (
  <Form onSubmit={() => {}}>
    {({ formProps, submitting }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);
      `,
		'should not migrate when anything other than `formProps` is an arg in child function',
	);
});
