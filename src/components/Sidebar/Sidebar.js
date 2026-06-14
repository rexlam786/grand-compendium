import TreeNode from "../TreeNode/TreeNode";

import "./Sidebar.css";

export default function Sidebar({
  nodes,
  setNodes,
  selectedId,
  setSelectedId,
  sidebarOpen,
  setSidebarOpen,
  searchTerm,
  setSearchTerm,
}) {
  const rootNodes = nodes.filter(
    (n) => n.parentId === null
  );

  const addRootNode = () => {
    setNodes([
      ...nodes,
      {
        id: crypto.randomUUID(),
        title: "New Chapter",
        content: "",
        parentId: null,
        expanded: false,
        order: Date.now(),
      },
    ]);
  };

  const filteredNodes = nodes.filter(
    (node) =>
      node.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      node.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );



  return (
    <div
      className={`sidebar ${
        sidebarOpen ? "" : "closed"
      }`}
    >
      <div className="sidebar-header">
        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
        >
          ☰
        </button>

        <button onClick={addRootNode}>
          + Root
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />

      {searchTerm
        ? filteredNodes.map((node) => (
            <div
              key={node.id}
              onClick={() =>
                setSelectedId(node.id)
              }
              style={{
                padding: 8,
                cursor: "pointer",
                borderBottom:
                  "1px solid #444",
              }}
            >
              {node.title}
            </div>
          ))
        : rootNodes.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              nodes={nodes}
              setNodes={setNodes}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          ))}
    </div>
  );
}