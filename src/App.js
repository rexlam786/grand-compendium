import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import Editor from "./components/Editor/Editor";
import {
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

import { db } from "./services/firebase";

import "./App.css";

export default function App() {

useEffect(() => {
  const loadNodes = async () => {
    const querySnapshot =
      await getDocs(
        collection(db, "nodes")
      );

    const loadedNodes = [];

    querySnapshot.forEach((doc) => {
      loadedNodes.push(doc.data());
    });

    if (loadedNodes.length > 0) {
      setNodes(loadedNodes);
    }
  };

  loadNodes();
}, []);




  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem("compendium");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: crypto.randomUUID(),
            title: "My First Chapter",
            content: "Start writing...",
            parentId: null,
            expanded: true,
            order: Date.now(),
          },
        ];
  });

  const [selectedId, setSelectedId] = useState(
    nodes[0]?.id
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

const [saveStatus, setSaveStatus] =
  useState("saved");

useEffect(() => {
  setSaveStatus("saving...");

  const timeout = setTimeout(
    async () => {
      // LOCAL BACKUP

      localStorage.setItem(
        "compendium",
        JSON.stringify(nodes)
      );

      // FIREBASE SAVE

      for (const node of nodes) {
        await setDoc(
          doc(db, "nodes", node.id),
          node
        );
      }

      setSaveStatus("saved");
    },
    500
  );

  return () => clearTimeout(timeout);
}, [nodes]);

  return (
    <div className="app">
      {!sidebarOpen && (
  <button
    className="sidebar-open-button"
    onClick={() =>
      setSidebarOpen(true)
    }
  >
    ☰
  </button>
)}
      <Sidebar
        nodes={nodes}
        setNodes={setNodes}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <Editor
        nodes={nodes}
        setNodes={setNodes}
        selectedId={selectedId}
      />
      <div className="save-status">
  {saveStatus}
</div>
    </div>
    
  );
}