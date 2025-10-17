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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps}>
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps}>
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps}>
        <input />
      </form>
    )}
  </Form>
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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps: renamed }) => (
      <form {...renamed}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps: renamed }) => (
        <form {...renamed}>
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps: renamed }) => (
        <form {...renamed}>
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps: renamed }) => (
      <form {...renamed}>
        <input />
      </form>
    )}
  </Form>
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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar"
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar">
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar"
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar">
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>
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

const FormComponent1 = () => shouldRender && (
  <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => shouldRender && (
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
    return shouldRender && (
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

const formElement = shouldRender && (
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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => shouldRender && (
  (fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>)
);

const FormComponent2 = () => shouldRender && (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar"
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar">
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return shouldRender && (
      (fg('platform-design_system_team-form_conversion') ? <Form
        onSubmit={() => {}}
        formProps={{
          foo: "bar"
        }}><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} foo="bar">
            <input />
          </form>
        )}
      </Form>)
    );
  }
}

const formElement = shouldRender && (
  (fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar">
        <input />
      </form>
    )}
  </Form>)
);
      `,
		'should convert from function with single prop on form after conditional',
	);

	describe('Migrate existing props', () => {
		defineInlineTest(
			{ default: transformer, parser: 'tsx' },
			{},
			`
  import React from 'react';
  import Form from '@atlaskit/form';

  const FormComponent1 = () => (
    <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
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
            <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
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
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
          <input />
        </form>
      )}
    </Form>
  );
        `,
			`
  import React from 'react';
  import Form from '@atlaskit/form';

  import { fg } from '@atlaskit/platform-feature-flags';

  const FormComponent1 = () => (
    fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} autocomplete="off" id="foo" name="bar" noValidate><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      {fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} autocomplete="off" id="foo" name="bar" noValidate><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
            <input />
          </form>
        )}
      </Form>}
    </>
  );

  class FormComponent3 extends React.Component {
    render() {
      return fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} autocomplete="off" id="foo" name="bar" noValidate><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
            <input />
          </form>
        )}
      </Form>;
    }
  }

  const formElement = (
    fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} autocomplete="off" id="foo" name="bar" noValidate><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate>
          <input />
        </form>
      )}
    </Form>
  );
`,
			'should migrate existing props on `form` into their respective props on `Form`',
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
        <form {...formProps} aria-label="foo" aria-labelledby="bar">
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} aria-label="foo" aria-labelledby="bar">
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
            <form {...formProps} aria-label="foo" aria-labelledby="bar">
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
        <form {...formProps} aria-label="foo" aria-labelledby="bar">
          <input />
        </form>
      )}
    </Form>
  );
        `,
			`
  import React from 'react';
  import Form from '@atlaskit/form';

  import { fg } from '@atlaskit/platform-feature-flags';

  const FormComponent1 = () => (
    fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} label="foo" labelId="bar"><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} aria-label="foo" aria-labelledby="bar">
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      {fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} label="foo" labelId="bar"><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} aria-label="foo" aria-labelledby="bar">
            <input />
          </form>
        )}
      </Form>}
    </>
  );

  class FormComponent3 extends React.Component {
    render() {
      return fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} label="foo" labelId="bar"><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} aria-label="foo" aria-labelledby="bar">
            <input />
          </form>
        )}
      </Form>;
    }
  }

  const formElement = (
    fg('platform-design_system_team-form_conversion') ? <Form onSubmit={() => {}} label="foo" labelId="bar"><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} aria-label="foo" aria-labelledby="bar">
          <input />
        </form>
      )}
    </Form>
  );
        `,
			'should migrate existing props on `form` into different names',
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
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
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
            <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
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
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
          <input />
        </form>
      )}
    </Form>
  );
        `,
			`
  import React from 'react';
  import Form from '@atlaskit/form';

  import { fg } from '@atlaskit/platform-feature-flags';

  const FormComponent1 = () => (
    fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        quu: "qux"
      }}
      autocomplete="off"
      id="foo"
      name="bar"
      noValidate><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
          <input />
        </form>
      )}
    </Form>
  );

  const FormComponent2 = () => (
    <>
      {fg('platform-design_system_team-form_conversion') ? <Form
        onSubmit={() => {}}
        formProps={{
          quu: "qux"
        }}
        autocomplete="off"
        id="foo"
        name="bar"
        noValidate><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
            <input />
          </form>
        )}
      </Form>}
    </>
  );

  class FormComponent3 extends React.Component {
    render() {
      return fg('platform-design_system_team-form_conversion') ? <Form
        onSubmit={() => {}}
        formProps={{
          quu: "qux"
        }}
        autocomplete="off"
        id="foo"
        name="bar"
        noValidate><input /></Form> : <Form onSubmit={() => {}}>
        {({ formProps }) => (
          <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
            <input />
          </form>
        )}
      </Form>;
    }
  }

  const formElement = (
    fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        quu: "qux"
      }}
      autocomplete="off"
      id="foo"
      name="bar"
      noValidate><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} autocomplete="off" id="foo" name="bar" noValidate quu="qux">
          <input />
        </form>
      )}
    </Form>
  );
        `,
			'should migrate existing props on `form` into their respective props on `Form` and also use `formProps` if needed',
		);
	});

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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar",
      baz: "qux"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar",
        baz: "qux"
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar" baz="qux">
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: "bar",
        baz: "qux"
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo="bar" baz="qux">
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: "bar",
      baz: "qux"
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo="bar" baz="qux">
        <input />
      </form>
    )}
  </Form>
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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: 'bar',
      baz: { qux: 'qux' }
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: 'bar',
        baz: { qux: 'qux' }
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: 'bar',
        baz: { qux: 'qux' }
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: 'bar',
      baz: { qux: 'qux' }
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo={'bar'} baz={{ qux: 'qux' }}>
        <input />
      </form>
    )}
  </Form>
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

import { fg } from '@atlaskit/platform-feature-flags';

const FormComponent1 = () => (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: true
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo>
        <input />
      </form>
    )}
  </Form>
);

const FormComponent2 = () => (
  <>
    {fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: true
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo>
          <input />
        </form>
      )}
    </Form>}
  </>
);

class FormComponent3 extends React.Component {
  render() {
    return fg('platform-design_system_team-form_conversion') ? <Form
      onSubmit={() => {}}
      formProps={{
        foo: true
      }}><input /></Form> : <Form onSubmit={() => {}}>
      {({ formProps }) => (
        <form {...formProps} foo>
          <input />
        </form>
      )}
    </Form>;
  }
}

const formElement = (
  fg('platform-design_system_team-form_conversion') ? <Form
    onSubmit={() => {}}
    formProps={{
      foo: true
    }}><input /></Form> : <Form onSubmit={() => {}}>
    {({ formProps }) => (
      <form {...formProps} foo>
        <input />
      </form>
    )}
  </Form>
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
