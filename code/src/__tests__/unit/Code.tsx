import { mount, shallow } from 'enzyme';
import React from 'react';
import ThemedCode from '../../ThemedCode';
import Code from '../../components/Code';

const jsCode = `const map = new Map({ key: 'value' })`;

const javaCode = `public class HelloWorld
{
	public static void main(String[] args) {
		System.out.println("Hello World!");
	}
}`;

const pyCode = `def transform_data(data_frame, rolling_value):
rolling_df = pd.DataFrame(data_frame)
return rolling_df.rolling(rolling_value, min_periods=1, center=True).mean()`;

const theme = { mode: 'dark' };

describe('Code', () => {
  const codeJavascript = <Code text={jsCode} language="javascript" />;
  const codeLanguageNotSupported = <Code text={jsCode} language="dde" />;
  test('should render with language javascript', () => {
    expect(mount(codeJavascript)).toBeDefined();
    expect(
      mount(codeJavascript)
        .find(Code)
        .prop('language'),
    ).not.toBe('');
  });
  test('should render with language that is not supported', () => {
    expect(mount(codeLanguageNotSupported).find(Code).length).toBe(1);
  });
  test('should apply theme', () => {
    expect(
      mount(<ThemedCode text={javaCode} language="java" theme={theme} />)
        .find(Code)
        .prop('theme'),
    ).toBe(theme);
  });
  test('should not show the line numbers', () => {
    expect(
      mount(<ThemedCode text={javaCode} language="java" />)
        .find(Code)
        .prop('showLineNumbers'),
    ).toBe(false);
  });
  test('should render a div instead of a span', () => {
    expect(
      mount(<ThemedCode preTag="div" text={pyCode} language="python" />)
        .find(Code)
        .prop('preTag'),
    ).not.toBe('span');
  });
  test('should render a div with a red color', () => {
    const wrapperRed = shallow(
      <ThemedCode
        preTag="div"
        codeTagProps={{ style: { color: 'red' } }}
        text={pyCode}
        language="python"
      />,
    );
    expect(wrapperRed).toMatchSnapshot();
  });
  test('should render a container with a blue color', () => {
    const wrapperBlue = shallow(
      <ThemedCode
        preTag="div"
        lineNumberContainerStyle={{ style: { color: 'blue' } }}
        text={pyCode}
        showLineNumbers
        language="python"
      />,
    );
    expect(wrapperBlue).toMatchSnapshot();
  });
  test('should passe along code style to LineNumbers', () => {
    const wrapperLineNumbers = shallow(
      <ThemedCode
        text={pyCode}
        language="python"
        codeStyle={{ style: { color: 'blue' } }}
        showLineNumbers
      />,
    );
    expect(wrapperLineNumbers).toMatchSnapshot();
  });
});
