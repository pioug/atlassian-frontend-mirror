const markdown = `

Regular, **Strong**, *Italic*, @Artur Bodera, ***Strong Italic***

---

[Regular link](//atlassian.com), [**strong link**](//atlassian.com), [***strong italic link***](//atlassian.com)

---

* Bullet list item 1
* Bullet list item 2

---

1. Number list item 1
2. Number list item 2

---

    private handleChange = () => {
      const { onChange } = this.props;
      if (onChange) {
        onChange(this);
      }
    }

---

> Block quote first paragraph
>
> Regular, **Strong**, *Italic*, ***Strong Italic***
>
> Bullet list item 1 Bullet list item 2
>
> Number list item 1 Number list item 2

---

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

![](https://atlaskit.atlassian.com/0bae81b1bba10e0256dff2f46c77af82.png)

`;

export default markdown;
