import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { EditorProvider } from '@tiptap/react'
import Typography from '@tiptap/extension-typography'

import Toolbar from "./Toolbar"
import HoveringToolbar from './HoveringToolbar'
import SmilieReplacer from './SmilieReplacer'

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Typography,
  SmilieReplacer,
]

const content = `a`

const TextEditor = () => {
  return (
    <EditorProvider slotBefore={<Toolbar />} extensions={extensions} content={content} >
      <HoveringToolbar/>
    </EditorProvider>
  )
}

export default TextEditor