const BaseTools = ({ editor }) => {
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
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active format-button' : 'format-button'}
      >
        code
      </button>
      {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active format-button' : 'format-button'}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active format-button' : 'format-button'}
      >
        ordered list
      </button>
      <input
        type="color"
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color}
        className='color-input'
      />
      <input
        type="color"
        onInput={event => editor.chain().focus().setHighlight({color: event.target.value}).run()}
        value={editor.getAttributes('textStyle').color}
        className='color-input'
      />
      <button 
        onClick={() => editor.chain().focus().setTextAlign('left').run()} 
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active format-button' : 'format-button'}>
        left
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('center').run()} 
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active format-button' : 'format-button'}>
        center
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('right').run()} 
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active format-button' : 'format-button'}>
        right
      </button>
      <button 
        onClick={() => editor.chain().focus().setTextAlign('justify').run()} 
        className={editor.isActive({ textAlign: 'justify' }) ? 'is-active format-button' : 'format-button'}>
        justify
      </button>
    </>
  )
}

export default BaseTools;