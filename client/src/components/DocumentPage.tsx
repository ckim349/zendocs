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

import { LineHeight } from '../tiptap_extensions/LineHeight'
import { SmilieReplacer } from '../tiptap_extensions/SmilieReplacer'
import TextEditor from './TextEditor'
import Toolbar from './Toolbar'
import ToggleDarkMode from './ToggleDarkMode'
import Menubar from './Menubar'
import { useParams } from 'react-router-dom'
import { loadDocument, updateDocument } from '../utils/documentRequests'
import DeleteModal from './modals/DeleteModal'
import ShareModal from './modals/ShareModal'

export type CustomEditor = Editor | null;

export interface DarkModeProps {
  handleChange: () => void;
  isDark: boolean;
}

const DocumentPage = ({ handleChange, isDark }: DarkModeProps) => {
  // const [docId, setDocId] = useState();
  const { id: docId } = useParams();

  const [docTitle, setDocTitle] = useState<string>("");
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [zen, setZen] = useState(false);
  // const [saved, setSaved] = useState(true);

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!zen) {
        return;
      }
      if (!document.fullscreenElement) {
        setZen(false);
      }
    };
    addEventListener("fullscreenchange", onFullscreenChange);
  })

  if (!docId) {
    return null;
  }

  function openDeleteModal() {
    setDeleteModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false);
    document.body.style.overflow = 'unset';
  }

  function handleDelete() {
    setDeleteConfirmed(true);
    closeDeleteModal();
  }

  function openShareModal() {
    setShareModalIsOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeShareModal() {
    setShareModalIsOpen(false);
    document.body.style.overflow = 'unset';
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

  // const localProvider = useMemo(() => {
  //   const provider = new IndexeddbPersistence(docId, doc);
  //   return provider;
  // }, [doc]);

  useEffect(() => {
    // localProvider.on('synced', () => {
    //   console.log('local provider has been synced')
    // })
    // Udpate database document 3 seconds after last update
    doc.on('update', update => {
      const base64Encoded = fromUint8Array(update)
      debounceUpdate(base64Encoded, docId);
    })
    const debounceUpdate = debounce(async (base64Encoded, docId) => {
      updateDocument(base64Encoded, docId, docTitle);
    }, 3000);

    const initialiseDocument = async () => {
      // Load document from local and remote database
      const storedDoc = await loadDocument(docId);
      if (storedDoc.content !== "AA==" || storedDoc.content !== "AAA==" || storedDoc.content !== null) {
        Y.applyUpdate(doc, toUint8Array(storedDoc.content));
      }
      setDocTitle(storedDoc.title);
    }

    initialiseDocument();

  }, [doc]);

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
    <div className={zen ? 'zen' : ''}>
      <div className='container' data-theme={isDark ? "dark" : "light"}>
        {deleteModalIsOpen ? <DeleteModal closeModal={closeDeleteModal} handleDelete={handleDelete}></DeleteModal> : null}
        {shareModalIsOpen ? <ShareModal closeModal={closeShareModal} ></ShareModal> : null}
        <div className="document-nav-bar">
          <EditorContent onKeyDown={handleTitleEditorKeyDown} className='document-title' editor={titleEditor} />
          <Menubar editor={editor} titleEditor={titleEditor} title={docTitle} docId={docId} doc={doc} deleteConfirmed={deleteConfirmed} openDeleteModal={openDeleteModal} setDeleteConfirmed={setDeleteConfirmed} openShareModal={openShareModal} setZen={setZen} />
          <ToggleDarkMode handleChange={handleChange} isDark={isDark} />
          <Toolbar editor={editor} />
        </div>
        <div className='document'>
          <EditorContent className="main-editor" editor={editor} />
          <TextEditor editor={editor} />
        </div>
      </div>
    </div>

  )
}

export default DocumentPage