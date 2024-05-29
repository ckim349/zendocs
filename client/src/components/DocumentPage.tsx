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
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
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
import Placeholder from '@tiptap/extension-placeholder'
import { fromUint8Array, toUint8Array } from 'js-base64'
import { TiptapCollabProvider } from '@hocuspocus/provider'
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react'
import * as Y from 'yjs'
import { IndexeddbPersistence } from 'y-indexeddb'


import { LineHeight } from '../tiptap_extensions/LineHeight'
import { SmilieReplacer } from '../tiptap_extensions/SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'
import ToggleDarkMode from './ToggleDarkMode'
import Menubar from './Menubar'
import { useParams } from 'react-router-dom'
import { idb } from '../utils/idb'

export type CustomEditor = Editor | null;

export interface DarkModeProps {
  handleChange: () => void;
  isDark: boolean;
}

const DocumentPage = ({ handleChange, isDark }: DarkModeProps) => {
  // const [docId, setDocId] = useState();
  const { id: docId } = useParams();
  const [docTitle, setDocTitle] = useState<string>("");
  // const [saved, setSaved] = useState(true);

  if (!docId) {
    return null;
  }

  const doc = useMemo(() => new Y.Doc(), [docId])

  const remoteProvider = useMemo(() => {
    const provider = new TiptapCollabProvider({
      name: docId, // Unique document identifier for syncing. This is your document name.
      appId: '7j9y6m10', // Your Cloud Dashboard AppID or `baseURL` for on-premises
      token: 'notoken',
      document: doc,
    })
    return provider;
  }, [doc]);

  const localProvider = useMemo(() => {
    const provider = new IndexeddbPersistence(docId, doc);
    return provider;
  }, [doc]);

  useEffect(() => {
    localProvider.on('synced', () => {
      console.log('local provider has been synced')
    })
    // Udpate database document 4 seconds after last update
    doc.on('update', update => {
      const base64Encoded = fromUint8Array(update)
      debounceUpdate(base64Encoded, docId);
    })
    const debounceUpdate = debounce(async (base64Encoded, docId) => {
      try {
        const response = await fetch('http://localhost:5000/document/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            documentId: docId,
            title: null,
            content: base64Encoded
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        // setSaved(true);
      }
    }, 4000);

    // Load document from database
    fetch(`http://localhost:5000/document/load/${docId}`, {
      method: "GET"
    })
      .then((response) => response.json())
      .then((data) => {
        const update = toUint8Array(data.docToFind.content);
        Y.applyUpdate(doc, update);
        setDocTitle(data.docToFind.title);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [doc]);

  useEffect(() => {
    const updateTitle = async () => {
      try {
        const response = await fetch('http://localhost:5000/document/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            documentId: docId,
            title: docTitle,
            content: null
          }),
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    if (docTitle) {
      updateTitle();
    }
  }, [docTitle]);

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
        document: remoteProvider.document,
        field: 'default',
      }),
      CollaborationCursor.configure({
        provider: remoteProvider,
        //   user: {
        //     name: 'Goon Goon',
        //     color: '#f783ac',
        //   },
      }),
      CodeBlock,
      ListItem,
      LineHeight,
    ],
    content: ``,
  })

  const titleEditor = useEditor({
    extensions: [
      Document.extend({
        content: "heading"
      }),
      Text,
      Heading.configure({
        levels: [2]
      }),
      Placeholder.configure({
        placeholder: "Enter a title"
      }),
      Collaboration.configure({
        document: remoteProvider.document,
        field: "title"
      }),
      // CollaborationCursor.configure({
      //   provider: remoteProvider,
      //   // user: userCursor
      // }),
    ],
    content: `${docTitle}`
  });

  function handleTitleEditorKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (!titleEditor || !editor) return
    const selection = titleEditor.state.selection
    if (event.shiftKey) {
      return
    }

    if (event.key === "Enter" || event.key === "ArrowDown") {
      setDocTitle(titleEditor.getText());
      editor.commands.focus("start")
    }

    if (event.key === "ArrowRight") {
      if (selection?.$head.nodeAfter === null) {
        editor.commands.focus("start")
      }
    }
  }

  if (!editor || !titleEditor) {
    return null;
  }

  return (
    <div className='container' data-theme={isDark ? "dark" : "light"}>
      <div className="document-nav-bar">
        <EditorContent onKeyDown={handleTitleEditorKeyDown} className='document-title' editor={titleEditor} />
        <Menubar title={docTitle} doc={doc} />
        <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
        <Toolbar editor={editor} />
      </div>
      <div>
        <div className='document'>
          <EditorContent className="main-editor" editor={editor} />
          <TextEditor editor={editor} />
        </div>
      </div>
    </div>
  )
}

export default DocumentPage