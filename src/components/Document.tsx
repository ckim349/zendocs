import { Editor, EditorContent, useEditor } from '@tiptap/react'
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
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'

import Drawing from "./DrawingExtension"
import SmilieReplacer from './SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'
import ToggleDarkMode from './ToggleDarkMode'
import useLocalStorage from 'use-local-storage'

export type CustomEditor = Editor | null;

const Document = () => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);  

  const doc = new Y.Doc();

  // Set up IndexedDB for local storage of the Y document
  new IndexeddbPersistence('example-document', doc);

  const provider = new TiptapCollabProvider({
    name: "document.name", // Unique document identifier for syncing. This is your document name.
    appId: '0k3q8d95', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTQ4NzE3NzQsIm5iZiI6MTcxNDg3MTc3NCwiZXhwIjoxNzE0OTU4MTc0LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiIwazNxOGQ5NSJ9.pmTtqOAPJMN5Er3OpmEe_zsnMfJ1-USOaaCGThzxME4', // for testing
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
      TextStyle,
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
      CollaborationCursor.configure({
        provider,
        user: {
          name: 'Goon Goon',
          color: '#f783ac',
        },
      }),
      ListItem,
    ],
    content: ``,
  })

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <ToggleDarkMode handleChange={() => setIsDark(!isDark)} isChecked={isDark}/>
      <div>
        <Toolbar editor={editor}/>
        <div className='document'>
          <EditorContent editor={editor} /> 
          <TextEditor editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default Document