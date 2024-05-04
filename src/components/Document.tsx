import { EditorContent, useEditor } from '@tiptap/react'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'

import Drawing from "./DrawingExtension"
import SmilieReplacer from './SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'

const Document = () => {
  const doc = new Y.Doc();

  const provider = new TiptapCollabProvider({
    name: "document.name", // Unique document identifier for syncing. This is your document name.
    appId: '7j9y6m10', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: 'notoken', // Your JWT token
    document: doc,

    onSynced() {

      if( !doc.getMap('config').get('initialContentLoaded') && editor ){
        doc.getMap('config').set('initialContentLoaded', true);
  
        editor.commands.setContent(`
        <p>
          goon be gooning
        </p>
        `)
      }
  }})

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
        history: false,
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
      Collaboration.configure({
        document: doc
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