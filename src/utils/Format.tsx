import { Editor, Transforms, Element } from 'slate'

export const toggleFormat = (editor, format) => {
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

export const isFormatActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const toggleCode = (editor) => {
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