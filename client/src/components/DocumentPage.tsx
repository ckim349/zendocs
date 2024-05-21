import { Editor, EditorContent, useEditor } from '@tiptap/react'
import Typography from '@tiptap/extension-typography'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import CharacterCount from '@tiptap/extension-character-count'
import Gapcursor from '@tiptap/extension-gapcursor'
import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Collaboration from '@tiptap/extension-collaboration'
// import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import CodeBlock from '@tiptap/extension-code-block'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Document from '@tiptap/extension-document'
import Text from '@tiptap/extension-text'
import Paragraph from '@tiptap/extension-paragraph'
import Heading from '@tiptap/extension-heading'
import Bold from '@tiptap/extension-bold'
import Code from '@tiptap/extension-code'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import FontFamily from '@tiptap/extension-font-family'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'

import { LineHeight } from '../tiptap_extensions/LineHeight'
import { SmilieReplacer } from '../tiptap_extensions/SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'
import ToggleDarkMode from './ToggleDarkMode'
import Menubar from './Menubar'
import { useEffect, useState } from 'react'
import * as Y from 'yjs'

export type CustomEditor = Editor | null;

export interface DarkModeProps {
  handleChange: () => void;
  isDark: boolean;
}

const DocumentPage = ({ handleChange, isDark }: DarkModeProps) => {
  const [docId, setDocId] = useState();
  const [docTitle, setDocTitle] = useState();

  // set up yjs doc with local storage and tiptapcollabprovider
  const doc = new Y.Doc();
  new IndexeddbPersistence('example-document', doc);
  const provider = new TiptapCollabProvider({
    name: "documentname", // Unique document identifier for syncing. This is your document name.
    appId: '0k3q8d95', // Your Cloud Dashboard AppID or `baseURL` for on-premises
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTQ4NzE3NzQsIm5iZiI6MTcxNDg3MTc3NCwiZXhwIjoxNzE0OTU4MTc0LCJpc3MiOiJodHRwczovL2Nsb3VkLnRpcHRhcC5kZXYiLCJhdWQiOiIwazNxOGQ5NSJ9.pmTtqOAPJMN5Er3OpmEe_zsnMfJ1-USOaaCGThzxME4', // for testing
    document: doc,
  })

  useEffect(() => {
    const documentIdToLoad = 'b34f778d-2f40-41a0-8cb4-7502999ca4b7';

    fetch(`http://localhost:5000/document/load/${documentIdToLoad}`, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        const update = toUint8Array(data.docToFind.content);
        Y.applyUpdate(doc, update);
        console.log(data.docToFind.documentId);
        setDocId(data.docToFind.documentId);
        setDocTitle(data.docToFind.title);
        // CURRENTLY NOT WORKING 
        console.log(data.docToFind.documentId);
        console.log(data.docToFind.title);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      Paragraph,
      Heading,
      Bold,
      Code,
      Italic,
      Strike,
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      BulletList.configure({
        keepMarks: true,
        keepAttributes: false,
      }),
      OrderedList.configure({
        keepMarks: true,
        keepAttributes: true,
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Typography,
      SmilieReplacer,
      Image,
      Dropcursor,
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
      // CollaborationCursor.configure({
      //   provider,
      //   user: {
      //     name: 'Goon Goon',
      //     color: '#f783ac',
      //   },
      // }),
      CodeBlock,
      ListItem,
      LineHeight,
    ],
    content: ``,
  })

  if (!editor) {
    return null;
  }

  // TODO Update only after four seconds of NO updates
  doc.on('update', update => {
    // console.log(update)
    const base64Encoded = fromUint8Array(update)
    fetch('http://localhost:5000/document/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "documentId": 'b34f778d-2f40-41a0-8cb4-7502999ca4b7',
        "title": docTitle,
        "content": base64Encoded
      }),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  })

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <div className="document-nav-bar">
        <Menubar />
        <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
        <Toolbar editor={editor} />
      </div>
      <div>
        <div className='document'>
          <EditorContent editor={editor} />
          <TextEditor editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default DocumentPage