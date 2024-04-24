import { useCallback, useMemo, useState } from 'react'
import { Editor, Transforms, Element, createEditor, BaseEditor, Descendant } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'

enum Hotkeys {
  'b' = 'bold',
  'i' = 'italic',
  'u' = 'underline',
  '`' = 'code'
}

const toggleFormat = (editor, format) => {
  if (format === 'code') {
    toggleCode(editor);
  } else {
    // Checks current format then toggles it
    const isActive = isFormatActive(editor, format)

    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }
}

const isFormatActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const toggleCode = (editor) => {
  // Checks current code format then toggles it
  const [match] = Editor.nodes(editor, {
    match: n => n.type === 'code',
  })
  const isActive = !!match;

  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : 'code' },
    { match: n => Element.isElement(n) && Editor.isBlock(editor, n) }
  )
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

// Define a React component to render leaves
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>
  }

  return <span {...attributes}>{children}</span>
}

const Document = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  // Update the initial content to be pulled from Local Storage if it exists.
  const initialValue: Descendant[] = useMemo(
    () =>
      JSON.parse(localStorage.getItem('content')) || [
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ],
    []
  )

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, []);
  
  return (
    <Slate 
      editor={editor} 
      initialValue={initialValue}
      onChange={value => {
        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        )
        if (isAstChange) {
          // Save the value to Local Storage.
          const content = JSON.stringify(value)
          localStorage.setItem('content', content)
        }
      }}
    >
      <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'bold')
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'italic')
          }}
        >
          Italic
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'underline')
          }}
        >
          Underline
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'strikethrough')
          }}
        >
          Strikethrough
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'code')
          }}
        >
          Code Block
        </button>
      </div>
      <div className='editor'>
        <Editable 
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={event => {
            if (!event.ctrlKey) {
              return
            }
            event.preventDefault();
            if (event.key in Hotkeys) {
              toggleFormat(editor, Hotkeys[event.key]);
            }
          }}
          />
      </div>
    </Slate>
)}

export default Document