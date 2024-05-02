import { NodeViewContent, NodeViewWrapper } from '@tiptap/react'

export default () => {
  return (
    <NodeViewWrapper className="react-component-with-content">
      <span className="label" contentEditable={false}>Drawing Component</span>

      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}