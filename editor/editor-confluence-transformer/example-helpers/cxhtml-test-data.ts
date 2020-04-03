export const CODE_MACRO = `<ac:structured-macro ac:name="code" ac:schema-version="1" ac:macro-id="1c61c2dd-3574-45f3-ac07-76d400504d84"><ac:parameter ac:name="language">js</ac:parameter><ac:parameter ac:name="theme">Confluence</ac:parameter><ac:parameter ac:name="title">Example</ac:parameter><ac:plain-text-body><![CDATA[if (true) {
  console.log('Hello World');
}]]></ac:plain-text-body></ac:structured-macro>`;

export const JIRA_ISSUE =
  '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="a1a887df-a2dd-492b-8b5c-415d8eab22cf"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter><ac:parameter ac:name="key">ED-1068</ac:parameter></ac:structured-macro></p>';

export const JIRA_ISSUES_LIST =
  '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro></p>';

export const PANEL_MACRO = `<ac:structured-macro ac:name="warning" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">Hello</ac:parameter><ac:rich-text-body><p>Warning panel</p></ac:rich-text-body></ac:structured-macro>`;

export const INLINE_EXTENSION =
  '<p><ac:structured-macro ac:name="status" ac:schema-version="1" ac:macro-id="1511498935556"> <ac:parameter ac:name="color">Red</ac:parameter> <ac:parameter ac:name="title">Fail</ac:parameter> <ac:parameter ac:name="subtle">true</ac:parameter> <fab:display-type>INLINE</fab:display-type> </ac:structured-macro></p>';

export const EXTENSION =
  '<ac:structured-macro ac:name="gallery" ac:schema-version="1" ac:macro-id="1511499023528"> <ac:parameter ac:name="color">Red</ac:parameter> <fab:placeholder-url>//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2dhbGxlcnl9&amp;locale=en_GB&amp;version=2</fab:placeholder-url> <fab:display-type>BLOCK</fab:display-type></ac:structured-macro>';

export const BODIED_EXTENSION =
  '<ac:structured-macro ac:name="expand" ac:schema-version="1" ac:macro-id="1511499130537"> <fab:placeholder-url>//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e2V4cGFuZH0&amp;locale=en_GB&amp;version=2</fab:placeholder-url> <fab:display-type>BLOCK</fab:display-type> <ac:rich-text-body> <h5>Heading</h5> <p> <u>Foo</u> </p> </ac:rich-text-body></ac:structured-macro>';

export const BODIED_NESTED_EXTENSION =
  '<ac:structured-macro ac:name="expand" ac:schema-version="1" ac:macro-id="1511499178897"> <fab:display-type>BLOCK</fab:display-type> <ac:rich-text-body> <h5>Heading</h5> <p> <u>Foo</u> <ac:structured-macro ac:name="status" ac:schema-version="1" ac:macro-id="1511499178897"> <ac:parameter ac:name="color">Green</ac:parameter> <ac:parameter ac:name="title">OK</ac:parameter> <ac:parameter ac:name="subtle">true</ac:parameter> <fab:placeholder-url>//pug.jira-dev.com/wiki/plugins/servlet/confluence/placeholder/macro?definition=e3N0YXR1czpzdWJ0bGU9dHJ1ZXxjb2xvdXI9R3JlZW58dGl0bGU9T0t9&amp;locale=en_GB&amp;version=2</fab:placeholder-url> <fab:display-type>INLINE</fab:display-type> </ac:structured-macro> </p> </ac:rich-text-body></ac:structured-macro>';

export const DATE = '<time datetime="2017-11-23" />';
