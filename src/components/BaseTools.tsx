import { Menu } from '@headlessui/react'
import { CustomEditor } from './DocumentPage';

const BaseTools = ({ editor }: { editor: CustomEditor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
        className={editor.isActive('bold') ? 'is-active format-button' : 'format-button'}
      >
        B
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
        className={editor.isActive('italic') ? 'is-active format-button' : 'format-button'}
      >
        I
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleUnderline()
            .run()
        }
        className={editor.isActive('underline') ? 'is-active format-button' : 'format-button'}
      >
        U
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={
          !editor.can()
            .chain()
            .focus()
            .toggleStrike()
            .run()
        }
        className={editor.isActive('strike') ? 'is-active format-button' : 'format-button'}
      >
        Strk
      </button>
      {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active format-button' : 'format-button'}
      >
        •
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active format-button' : 'format-button'}
      >
        1
      </button>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='format-button'>
          Font
        </Menu.Button>
        <Menu.Items className='dropdown-items'>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setFontFamily('Inter').run()}
              className={editor.isActive('textStyle', { fontFamily: 'Inter' }) ? 'is-active format-button' : 'format-button'}
            >
              Inter
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setFontFamily('Comic Sans MS, Comic Sans').run()}
              className={
                editor.isActive('textStyle', { fontFamily: 'Comic Sans MS, Comic Sans' })
                  ? 'is-active format-button'
                  : 'format-button'
              }
            >
              Comic Sans
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <input
        type="color"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color || '#000000'}
        className='color-input'
        id='colour'
      />
      <label htmlFor='colour'>A</label>
      <input
        type="color"
        onInput={(event: React.ChangeEvent<HTMLInputElement>) => editor.chain().focus().setHighlight({ color: event.target.value }).run()}
        value={editor.getAttributes('highlight').color || '#000000'}
        className='color-input'
        id='highlight'
      />
      <label htmlFor='highlight'>H</label>
      <button
        onClick={() => editor.chain().focus().unsetHighlight().run()}
        disabled={!editor.isActive('highlight')}
        className='format-button'
      >
        Remove highlight
      </button>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='format-button text-align-button'>
          Text Align
        </Menu.Button>
        <Menu.Items className='dropdown-items text-align-button'>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'is-active format-button' : 'format-button'}
            >
              Left
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'is-active format-button' : 'format-button'}>
              Center
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'is-active format-button' : 'format-button'}>
              Right
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? 'is-active format-button' : 'format-button'}>
              Justify
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Menu as='div' className='menubar-dropdown'>
        <Menu.Button className='format-button text-style-button'>
          Text Style
        </Menu.Button>
        <Menu.Items className='dropdown-items text-style-button'>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive('paragraph') ? 'is-active format-button' : 'format-button'}
            >
              Paragraph
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive('heading', { level: 1 }) ? 'is-active format-button' : 'format-button'}
            >
              Heading 1
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active format-button' : 'format-button'}
            >
              Heading 2
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive('heading', { level: 2 }) ? 'is-active format-button' : 'format-button'}
            >
              Heading 3
            </button>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  )
}

export default BaseTools;