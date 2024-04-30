import {
  BubbleMenu,
  useCurrentEditor,
} from '@tiptap/react'
import BaseTools from './BaseTools'

const HoveringToolbar = () => {
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <BubbleMenu tippyOptions={{ duration: 100 }} editor={editor}>
      <BaseTools />
    </BubbleMenu>
  )
}

export default HoveringToolbar;