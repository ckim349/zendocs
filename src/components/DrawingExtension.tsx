import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react'
import DrawingComponent from './DrawingComponent'

export default Node.create({
  name: 'drawing',

  group: 'block',

  content: 'inline*',

  parseHTML() {
    return [
      {
        tag: 'drawing',
      },
    ]
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        return this.editor.chain().insertContentAt(this.editor.state.selection.head, { type: this.type.name }).focus().run()
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['drawing', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DrawingComponent)
  },
})