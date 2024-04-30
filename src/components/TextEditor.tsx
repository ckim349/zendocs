import { useCurrentEditor } from '@tiptap/react'

import HoveringToolbar from './HoveringToolbar'

const TextEditor = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }
  return (
    <>
      <HoveringToolbar/>
      <div className="character-count">
        {editor.storage.characterCount.characters()} characters
        <br />
        {editor.storage.characterCount.words()} words
      </div>
    </>
  )
}

export default TextEditor