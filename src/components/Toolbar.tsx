import { toggleFormat } from '../utils/Format'

const Toolbar = ({ editor }) => {
  return (
    <div>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'bold')
          }}
        >
          Bold
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'italic')
          }}
        >
          Italic
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'underline')
          }}
        >
          Underline
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'strikethrough')
          }}
        >
          Strikethrough
        </button>
        <button
          onMouseDown={event => {
            event.preventDefault()
            toggleFormat(editor, 'code')
          }}
        >
          Code Block
        </button>
      </div>
  )
}

export default Toolbar