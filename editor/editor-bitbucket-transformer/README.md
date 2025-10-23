# @atlaskit/editor-bitbucket-transformer

## Caption escaping and the Markdown/HTML/ADF pipeline

This package serializes ADF to Markdown for storage, and later reconstructs ADF from HTML that is rendered by the backend using python-markdown. Image captions are stored in Markdown using python-markdown’s `attr_list` syntax on the image:

```
![](http://path/to/image.jpg){: data-layout='center' data-caption='...'}
```

### Why escaping captions is tricky

- python-markdown parses Markdown first, then applies `attr_list` to bind attributes to elements. If caption text inside `data-caption` contains Markdown markers (e.g. `**`, `__`, `` ` ``, `~~`), those markers can be interpreted during Markdown parsing.
- When Markdown markers are interpreted within the attribute text, the attribute list can be malformed or ejected, resulting in the attributes not being set on the element (e.g. losing `data-caption`).

### Unified attribute escaping

To ensure captions survive the Markdown → HTML transformation safely, we use a unified escaping strategy:

- `escapeHtmlAttribute(text)`: Escapes both HTML attribute meta characters (`&`, `<`, `>`, `"`, `'`) and Markdown/attr_list-sensitive punctuation by converting them into numeric entities:
  - `*` → `&#42;`, `_` → `&#95;`, `` ` `` → `&#96;`, `~` → `&#126;`
  - `|` → `&#124;`, `{` → `&#123;`, `}` → `&#125;`
  - `[` → `&#91;`, `]` → `&#93;`, `(` → `&#40;`, `)` → `&#41;`, `!` → `&#33;`
- This prevents python-markdown from interpreting the caption content as Markdown or as part of an attr_list, preserving the attribute safely.

- `unescapeHtmlAttribute(text)`: Decodes the same superset of entities when reading back from HTML into ADF. Decoding is order-sensitive—`&amp;` is decoded last to prevent double-unescape issues. After unescaping, we sanitize and parse a limited subset of Markdown formatting for display (`**`, `_`, `~~`, and `` ` ``) into safe HTML tags we control.

### End-to-end flow

1. ADF → Markdown (bbc-frontbucket - using this package):
   - Captions are serialized into `data-caption` using `escapeHtmlAttribute` to encode HTML meta characters and Markdown punctuation.
2. Markdown → HTML (bbc-core):
   - python-markdown takes markdown renders HTML and applies `attr_list`. 
   - Because punctuation was entity-encoded, the attributes remain intact even if the caption contains Markdown markers or `{...}`-like text.
3. HTML → ADF (frontend):
   - We read `data-caption` from the html and call `unescapeHtmlAttribute`, which decodes both HTML and punctuation entities. 
   -  We then sanitize and parse a safe subset of Markdown to generate ADF caption nodes (e.g., `<strong>`, `<em>`, `<s>`, `<code>`).

### Migration

- `escapeAttrListValue` has been removed. Use `escapeHtmlAttribute` and `unescapeHtmlAttribute`.

### Security considerations

- We always encode `<` and `>` in attributes and, when parsing back from HTML, we sanitize caption content before any Markdown formatting is converted to HTML.
- Our Markdown parsing is intentionally minimal and maps directly to a small set of safe tags.
