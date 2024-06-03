import { Menu } from '@headlessui/react'
import { createDocument, deleteDocument, duplicateDocument } from "../utils/documentRequests";
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs'
import { CustomEditor } from './pages/DocumentPage';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface MenubarProps {
  editor: CustomEditor,
  titleEditor: CustomEditor,
  title: string,
  docId: string,
  doc: Y.Doc,
  deleteConfirmed: boolean,
  openDeleteModal: () => void,
  setDeleteConfirmed: React.Dispatch<React.SetStateAction<boolean>>,
  openShareModal: () => void,
  setZen: React.Dispatch<React.SetStateAction<boolean>>,
  setLink: () => void,
}

const Menubar = ({ editor, titleEditor, title, docId, doc, deleteConfirmed, openDeleteModal, setDeleteConfirmed, openShareModal, setZen, setLink }: MenubarProps) => {
  const navigate = useNavigate();
  const [isMacOs, setIsMacOs] = useState(false);

  useEffect(() => {
    if (window.navigator.userAgent.indexOf("Mac OS") != -1) {
      setIsMacOs(true)
    } else {
      setIsMacOs(false);
    }
  })

  useEffect(() => {
    if (deleteConfirmed) {
      deleteDocument(docId);
      navigate('/');
      setDeleteConfirmed(false);
    }
  }, [deleteConfirmed])

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const handleNew = () => {
    const documentId = uuidv4();
    createDocument(documentId, "Untitled");
    openInNewTab(`/document/${documentId}`)
  }

  const handleCopy = () => {
    const documentId = uuidv4();
    duplicateDocument(documentId, title, doc);
    openInNewTab(`/document/${documentId}`)
  }

  const handleRename = () => {
    if (!titleEditor || !editor) return
    titleEditor.commands.focus("all");
  }

  const handleDelete = () => {
    openDeleteModal();
  }

  const handleShare = () => {
    openShareModal();
  }

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 50);
  }

  const handleZen = () => {
    document.documentElement.requestFullscreen();
    setZen(true);
  }

  const handleImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="menubar">
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='menubar-dropdown-button'>
          File
        </Menu.Button>
        <Menu.Items className='dropdown-items menubar-dropdown-items'>
          <Menu.Item>
            <button onClick={handleNew} className='menubar-button'>
              New
            </button>
          </Menu.Item>
          <Menu.Item>
            <button onClick={handleCopy} className='menubar-button'>
              Make a copy
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button onClick={handleShare} className='menubar-button'>
              Share
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button onClick={handleRename} className='menubar-button'>
              Rename
            </button>
          </Menu.Item>
          <Menu.Item>
            <button onClick={handleDelete} className='menubar-button'>
              Delete document
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button onClick={handlePrint} className='menubar-button'>
              Print
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='menubar-dropdown-button'>
          Edit
        </Menu.Button>
        <Menu.Items className='dropdown-items menubar-dropdown-items'>
          <Menu.Item>
            <button onClick={() => editor?.chain().focus().undo().run()} className='menubar-button'>
              Undo {isMacOs ? '(Cmd+Z)' : '(Ctrl+Z)'}
            </button>
          </Menu.Item>
          <Menu.Item>
            <button onClick={() => editor?.chain().focus().redo().run()} className='menubar-button'>
              Redo {isMacOs ? '(Cmd+Y)' : '(Ctrl+Y)'}
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='menubar-dropdown-button'>
          View
        </Menu.Button>
        <Menu.Items className='dropdown-items menubar-dropdown-items'>
          <Menu.Item>
            <button onClick={() => document.documentElement.requestFullscreen()} className='menubar-button'>
              Full Screen
            </button>
          </Menu.Item>
          <Menu.Item>
            <button onClick={handleZen} className='menubar-button'>
              Zen Mode
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='menubar-dropdown-button'>
          Insert
        </Menu.Button>
        <Menu.Items className='dropdown-items menubar-dropdown-items'>
          <Menu.Item>
            <button onClick={handleImage} className='menubar-button'>
              Image
            </button>
          </Menu.Item>
          {/* <Menu.Item>
            <button className='menubar-button'>
              Drawing
            </button>
          </Menu.Item> */}
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button
              onClick={setLink}
              className='menubar-button'
            >
              Set link
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor?.chain().focus().unsetLink().run()}
              disabled={!editor?.isActive('link')}
              className='menubar-button'
            >
              Unset link
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div >
  )
}

export default Menubar