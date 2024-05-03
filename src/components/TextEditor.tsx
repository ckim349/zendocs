import { useCurrentEditor } from '@tiptap/react'
import HoveringToolbar from './HoveringToolbar'

const TextEditor = ({ editor }) => {
  if (!editor) {
    return null;
  }
  const isHoveringToolbarDisabled = window.matchMedia('(max-width: 900px)').matches;
  return (
    <>
      {isHoveringToolbarDisabled ? null
        :
        (
          <HoveringToolbar editor={editor} />
        )
      }
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </>
  )
}

export default TextEditor