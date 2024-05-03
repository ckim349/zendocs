import BaseTools from './BaseTools'

const Toolbar = ({ editor }) => {
  if (!editor) {
    return null;
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
      <BaseTools editor={editor} />
    </div>
  );
};

export default Toolbar