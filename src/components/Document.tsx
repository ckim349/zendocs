import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'

import Drawing from "./DrawingExtension"
import Toolbar from "./Toolbar"
import SmilieReplacer from './SmilieReplacer'
import TextEditor from './TextEditor'

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
  Image,
  Dropcursor,
  Drawing,
  CharacterCount,
  Gapcursor,
]

const content = ``

const Document = () => {
  return (
    <div className='document'>
      <EditorProvider slotBefore={<Toolbar />} extensions={extensions} content={content}>
        <TextEditor />
      </EditorProvider>
    </div>
  )
}

export default Document