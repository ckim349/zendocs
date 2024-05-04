import { BubbleMenu } from '@tiptap/react'
import BaseTools from './BaseTools'

const HoveringToolbar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const isHoveringToolbarDisabled = window.matchMedia('(max-width: 900px)').matches;

  return (
    <BubbleMenu className='hovering-toolbar' tippyOptions={{ duration: 100 }} editor={editor}>
      {isHoveringToolbarDisabled ? null
        :
        (
          <BaseTools editor={editor}/>
        )
      }
    </BubbleMenu>
  )
}

export default HoveringToolbar;