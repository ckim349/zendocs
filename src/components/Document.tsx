import { EditorContent, useEditor } from '@tiptap/react'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'
import { Editor } from "@tiptap/react";
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'

import Drawing from "./DrawingExtension"
import SmilieReplacer from './SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'

const Document = () => {
  const editor = useEditor({
    extensions: [
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
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: ``,
  })

  return (
    <div>
      <Toolbar editor={editor}/>
      <div className='document'>
        <EditorContent editor={editor} /> 
        <TextEditor editor={editor} />
      </div>
    </div>

  )
}

export default Document