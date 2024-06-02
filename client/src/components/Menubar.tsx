import { Menu } from '@headlessui/react'
import { createDocument, deleteDocument, duplicateDocument } from "../utils/documentRequests";
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs'
import { CustomEditor } from './DocumentPage';
import { useNavigate } from 'react-router-dom';

interface MenubarProps {
  editor: CustomEditor,
  titleEditor: CustomEditor,
  title: string,
  docId: string,
  doc: Y.Doc
}

const Menubar = ({ editor, titleEditor, title, docId, doc }: MenubarProps) => {
  const navigate = useNavigate();

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
    // modal to ask if you're sure
    deleteDocument(docId);
    navigate('/');
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
          {/* <Menu.Item>
            <button onClick={handleOpen} className='menubar-button'>
              Open
            </button>
          </Menu.Item> */}
          <Menu.Item>
            <button onClick={handleCopy} className='menubar-button'>
              Make a copy
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button className='menubar-button'>
              Share
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Download
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
            <button className='menubar-button'>
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
            <button className='menubar-button'>
              Undo
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Redo
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button className='menubar-button'>
              Cut
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Copy
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Paste
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Paste without formatting
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
            <button className='menubar-button'>
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
            <button className='menubar-button'>
              Image
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Drawing
            </button>
          </Menu.Item>
          <div>
            <hr></hr>
          </div>
          <Menu.Item>
            <button className='menubar-button'>
              Link
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='menubar-dropdown-button'>
          Format
        </Menu.Button>
        <Menu.Items className='dropdown-items menubar-dropdown-items'>
          <Menu.Item>
            <button className='menubar-button'>
              Text Format
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Text Align
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Text Style
            </button>
          </Menu.Item>
          <Menu.Item>
            <button className='menubar-button'>
              Line Spacing
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
  )
}

export default Menubar