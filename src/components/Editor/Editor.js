import "./Editor.css";

export default function Editor({
  nodes,
  setNodes,
  selectedId,
}) {
  const selectedNode = nodes.find(
    (n) => n.id === selectedId
  );

  if (!selectedNode) {
    return (
      <div className="editor">
        No chapter selected.
      </div>
    );
  }

  const updateNode = (field, value) => {
    setNodes(
      nodes.map((n) =>
        n.id === selectedId
          ? { ...n, [field]: value }
          : n
      )
    );
  };

  return (
    <div className="editor">
      <input
        className="editor-title"
        value={selectedNode.title}
        onChange={(e) =>
          updateNode(
            "title",
            e.target.value
          )
        }
      />

      <textarea
        className="editor-content"
        value={selectedNode.content}
        onChange={(e) =>
          updateNode(
            "content",
            e.target.value
          )}

          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();

              const start =
                e.target.selectionStart;

              const end =
                e.target.selectionEnd;

              const value =
                selectedNode.content;

              const updated =
                value.substring(0, start) +
                "    " +
                value.substring(end);

              updateNode("content", updated);

              setTimeout(() => {
                e.target.selectionStart =
                  e.target.selectionEnd =
                    start + 4;
              }, 0);
            }
          }}
      />
    </div>
  );
}