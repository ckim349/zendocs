import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Menubar from "./Menubar"
import { EditorProvider } from '@tiptap/react'
import HoveringToolbar from './HoveringToolbar'

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
]

const content = `a`

const TextEditor = () => {
  return (
    <EditorProvider slotBefore={<Menubar />} extensions={extensions} content={content}>
      <HoveringToolbar/>
    </EditorProvider>
  )
}

export default TextEditor