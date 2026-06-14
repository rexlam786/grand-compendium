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


const reorderSiblings = (
  draggedId,
  targetNode,
  position
) => {
  const draggedNode = nodes.find(
    (n) => n.id === draggedId
  );

  if (!draggedNode) return;

  // prevent self-drop

  if (draggedId === targetNode.id)
    return;

  // siblings of target

  const siblings = nodes
    .filter(
      (n) =>
        n.parentId ===
        targetNode.parentId
    )
    .sort((a, b) => a.order - b.order);

  // remove dragged node

  const filtered = siblings.filter(
    (n) => n.id !== draggedId
  );

  const targetIndex =
    filtered.findIndex(
      (n) => n.id === targetNode.id
    );

  const insertIndex =
    position === "above"
      ? targetIndex
      : targetIndex + 1;

  // insert dragged node

  filtered.splice(insertIndex, 0, {
    ...draggedNode,
    parentId: targetNode.parentId,
  });

  // regenerate clean order numbers

  const updated = filtered.map(
    (node, index) => ({
      ...node,
      order: index,
    })
  );

  setNodes(
    nodes.map((node) => {
      const updatedNode =
        updated.find(
          (u) => u.id === node.id
        );

      return updatedNode || node;
    })
  );
};

const getDepth = (nodeId) => {
  let depth = 0;

  let current = nodes.find(
    (n) => n.id === nodeId
  );

  while (current?.parentId) {
    depth++;

    current = nodes.find(
      (n) => n.id === current.parentId
    );
  }

  return depth;
};


const moveUp = () => {
  const siblings = nodes
    .filter(
      (n) =>
        n.parentId === node.parentId
    )
    .sort((a, b) => a.order - b.order);

  const index = siblings.findIndex(
    (n) => n.id === node.id
  );

  if (index <= 0) return;

  const previous =
    siblings[index - 1];

  setNodes(
    nodes.map((n) => {
      if (n.id === node.id)
        return {
          ...n,
          order: previous.order,
        };

      if (n.id === previous.id)
        return {
          ...n,
          order: node.order,
        };

      return n;
    })
  );
};

const moveDown = () => {
  const siblings = nodes
    .filter(
      (n) =>
        n.parentId === node.parentId
    )
    .sort((a, b) => a.order - b.order);

  const index = siblings.findIndex(
    (n) => n.id === node.id
  );

  if (
    index ===
    siblings.length - 1
  )
    return;

  const next =
    siblings[index + 1];

  setNodes(
    nodes.map((n) => {
      if (n.id === node.id)
        return {
          ...n,
          order: next.order,
        };

      if (n.id === next.id)
        return {
          ...n,
          order: node.order,
        };

      return n;
    })
  );
};

const depth = getDepth(node.id);

const depthColors = [
  "#4a90e2",
  "#50c878",
  "#ffb347",
  "#d291ff",
  "#ff7f7f",
];

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

          reorderSiblings(
            draggedId,
            node,
            "above"
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
          style={{
            borderLeft: `5px solid ${
              depthColors[
                depth % depthColors.length
              ]
            }`,
          }}
        
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

        {selectedId === node.id && (
          
          <div className="node-controls">
            <button
              className="tree-button"
              onClick={moveUp}
              title="Move Up"
            >
              ↑
            </button>

            <button
              className="tree-button"
              onClick={moveDown}
              title="Move Down"
            >
              ↓
            </button>

            <button
              className="tree-button"
              onClick={addChild}
              title="Add Child"
            >
              +
            </button>

            <button
              className="tree-button"
              onClick={deleteNode}
              title="Delete"
            >
              🗑
            </button>
          </div>
        )}
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

          reorderSiblings(
            draggedId,
            node,
            "below"
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