import "./TreeNode.css";

export default function TreeNode({
  node,
  nodes,
  setNodes,
  selectedId,
  setSelectedId,
}) {
  // SORTED CHILDREN

  const children = nodes
    .filter((n) => n.parentId === node.id)
    .sort((a, b) => a.order - b.order);

  // TOGGLE EXPAND

  const toggleExpanded = () => {
    setNodes(
      nodes.map((n) =>
        n.id === node.id
          ? {
              ...n,
              expanded: !n.expanded,
            }
          : n
      )
    );
  };

  // ADD CHILD

  const addChild = () => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        title: "New Subchapter",
        content: "",
        parentId: node.id,
        expanded: true,
        order: Date.now(),
      },
    ]);
  };

  // GET DESCENDANTS

  const getDescendants = (id) => {
    const directChildren = nodes.filter(
      (n) => n.parentId === id
    );

    let descendants = [];

    directChildren.forEach((child) => {
      descendants.push(child.id);

      descendants = [
        ...descendants,
        ...getDescendants(child.id),
      ];
    });

    return descendants;
  };

  // DELETE NODE

  const deleteNode = () => {
    const descendants = getDescendants(
      node.id
    );

    const idsToDelete = [
      node.id,
      ...descendants,
    ];

    const confirmed = window.confirm(
      "Delete this chapter and all subchapters?"
    );

    if (!confirmed) return;

    setNodes(
      nodes.filter(
        (n) => !idsToDelete.includes(n.id)
      )
    );
  };

  // DRAG START

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      "nodeId",
      node.id
    );
  };

  // MOVE NODE

  const moveNode = (
    draggedId,
    newParentId,
    newOrder
  ) => {
    // prevent self-parenting

    if (draggedId === node.id) return;

    // prevent recursive loops

    const descendants = getDescendants(
      draggedId
    );

    if (
      descendants.includes(newParentId)
    ) {
      return;
    }

    setNodes(
      nodes.map((n) =>
        n.id === draggedId
          ? {
              ...n,
              parentId: newParentId,
              order: newOrder,
            }
          : n
      )
    );
  };

  return (
    <div className="tree-node">
      {/* TOP DROP ZONE */}

      <div
        className="drop-zone"
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={(e) => {
          e.preventDefault();

          const draggedId =
            e.dataTransfer.getData(
              "nodeId"
            );

          moveNode(
            draggedId,
            node.parentId,
            node.order - 0.5
          );
        }}
      />

      {/* MAIN ROW */}

      <div
        className={`tree-row ${
          selectedId === node.id
            ? "selected"
            : ""
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={(e) => {
          e.preventDefault();

          const draggedId =
            e.dataTransfer.getData(
              "nodeId"
            );

          // DROP INTO NODE

          moveNode(
            draggedId,
            node.id,
            Date.now()
          );
        }}
      >
        {/* EXPAND ICON */}

        <span
          onClick={toggleExpanded}
          style={{ cursor: "pointer" }}
        >
          {children.length > 0
            ? node.expanded
              ? "▼"
              : "▶"
            : "•"}
        </span>

        {/* TITLE */}

        <span
          className="tree-title"
          onClick={() =>
            setSelectedId(node.id)
          }
        >
          {node.title}
        </span>

        {/* ADD CHILD */}

        <button
          className="tree-button"
          onClick={addChild}
        >
          +
        </button>

        {/* DELETE */}

        <button
          className="tree-button"
          onClick={deleteNode}
        >
          🗑
        </button>
      </div>

      {/* BOTTOM DROP ZONE */}

      <div
        className="drop-zone"
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={(e) => {
          e.preventDefault();

          const draggedId =
            e.dataTransfer.getData(
              "nodeId"
            );

          moveNode(
            draggedId,
            node.parentId,
            node.order + 0.5
          );
        }}
      />

      {/* CHILDREN */}

      {node.expanded &&
        children.map((child) => (
          <TreeNode
            key={child.id}
            node={child}
            nodes={nodes}
            setNodes={setNodes}
            selectedId={selectedId}
            setSelectedId={
              setSelectedId
            }
          />
        ))}
    </div>
  );
}