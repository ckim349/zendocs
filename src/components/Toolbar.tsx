import BaseTools from './BaseTools'
import { CustomEditor } from './Document';

const Toolbar = ({ editor }: {editor: CustomEditor}) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can()
          .chain()
          .focus()
          .undo()
          .run()}
        className='format-button'
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can()
          .chain()
          .focus()
          .redo()
          .run()}
        className='format-button'
      >
        Redo
      </button>
      <button 
        onClick={addImage}
        className='format-button'  
      >
        Add image
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active format-button' : 'format-button'}
      >
        Code
      </button>
      <BaseTools editor={editor} />
    </div>
  );
};

export default Toolbar