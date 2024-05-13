import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'
import { CustomEditor } from './DocumentPage';

const HoveringToolbar = ({ editor }: { editor: CustomEditor }) => {
  if (!editor) {
    return null;
  }

  const isHoveringToolbarDisabled = window.matchMedia('(max-width: 900px)').matches;

  return (
    <BubbleMenu className='hovering-toolbar' tippyOptions={{ duration: 100, placement: 'auto' }} editor={editor}>
      {isHoveringToolbarDisabled ? null : <BaseTools editor={editor} />}
    </BubbleMenu>
  )
}

export default HoveringToolbar;