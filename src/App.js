import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Editor from "./components/Editor/Editor";

import "./App.css";

import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "./services/firebase";

export default function App() {
  // INITIAL LOCAL FALLBACK

  const [nodes, setNodes] = useState(() => {
    const saved = localStorage.getItem(
      "compendium"
    );

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
            updatedAt: Date.now(),
          },
        ];
  });

  // SELECTED NODE

  const [selectedId, setSelectedId] =
    useState(null);

  // UI STATE

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [saveStatus, setSaveStatus] =
    useState("saved");

  // IMPORTANT:
  // prevents save effect from firing
  // before Firebase finishes loading

  const [isLoaded, setIsLoaded] =
    useState(false);

  // TRACK PREVIOUS IDS
  // needed for delete syncing

  const [previousNodeIds, setPreviousNodeIds] =
    useState([]);

  // LOAD FIREBASE DATA

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const querySnapshot =
          await getDocs(
            collection(db, "nodes")
          );

        const loadedNodes = [];

        querySnapshot.forEach((docSnap) => {
          loadedNodes.push(docSnap.data());
        });

        // SORT BY UPDATED TIME

        loadedNodes.sort(
          (a, b) =>
            (b.updatedAt || 0) -
            (a.updatedAt || 0)
        );

        // ONLY USE FIREBASE DATA
        // if it actually exists

        if (loadedNodes.length > 0) {
          setNodes(loadedNodes);

          setPreviousNodeIds(
            loadedNodes.map((n) => n.id)
          );

          setSelectedId(
            loadedNodes[0].id
          );

          // LOCAL BACKUP

          localStorage.setItem(
            "compendium",
            JSON.stringify(loadedNodes)
          );
        } else {
          // fallback to local

          setPreviousNodeIds(
            nodes.map((n) => n.id)
          );

          if (nodes.length > 0) {
            setSelectedId(nodes[0].id);
          }
        }
      } catch (error) {
        console.error(
          "Firebase load failed:",
          error
        );
      } finally {
        // CRITICAL

        setIsLoaded(true);
      }
    };

    loadNodes();
  }, []);

  // SAVE + SYNC EFFECT

  useEffect(() => {
    // IMPORTANT:
    // prevents empty startup overwrite

    if (!isLoaded) return;

    const syncNodes = async () => {
      try {
        setSaveStatus("saving...");

        // UPDATE TIMESTAMPS

        const updatedNodes = nodes.map(
          (node) => ({
            ...node,
            updatedAt:
              node.updatedAt ||
              Date.now(),
          })
        );

        // SAVE TO FIREBASE

        for (const node of updatedNodes) {
          await setDoc(
            doc(db, "nodes", node.id),
            node
          );
        }

        // DELETE REMOVED NODES

        const currentIds =
          updatedNodes.map((n) => n.id);

        const deletedIds =
          previousNodeIds.filter(
            (id) =>
              !currentIds.includes(id)
          );

        for (const id of deletedIds) {
          await deleteDoc(
            doc(db, "nodes", id)
          );
        }

        // UPDATE TRACKER

        setPreviousNodeIds(currentIds);

        // LOCAL BACKUP

        localStorage.setItem(
          "compendium",
          JSON.stringify(updatedNodes)
        );

        // OPTIONAL TIMESTAMPED BACKUP

        localStorage.setItem(
          `compendium-backup-${Date.now()}`,
          JSON.stringify(updatedNodes)
        );

        setSaveStatus("saved");
      } catch (error) {
        console.error(
          "Firebase save failed:",
          error
        );

        setSaveStatus("save failed");
      }
    };

    const timeout = setTimeout(
      syncNodes,
      500
    );

    return () => clearTimeout(timeout);
  }, [nodes, isLoaded]);


const importData = async (event) => {
  const file =
    event.target.files[0];

  if (!file) return;

  const text = await file.text();

  try {
    const importedNodes =
      JSON.parse(text);

    const confirmed =
      window.confirm(
        "Replace current compendium with imported backup?"
      );

    if (!confirmed) return;

    setNodes(importedNodes);

    localStorage.setItem(
      "compendium",
      JSON.stringify(importedNodes)
    );

    alert("Backup imported.");
  } catch (error) {
    console.error(error);

    alert("Invalid backup file.");
  }
};

const exportData = () => {
  const dataStr = JSON.stringify(
    nodes,
    null,
    2
  );

  const blob = new Blob([dataStr], {
    type: "application/json",
  });

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "grand-compendium-backup.json";

  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <div className="app">
      {/* REOPEN SIDEBAR BUTTON */}

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

      <div className="top-bar">
        <button onClick={exportData}>
          Export Backup
        </button>

        <label className="import-button">
          Import Backup
          <input
            type="file"
            accept=".json"
            onChange={importData}
            hidden
          />
        </label>
      </div>

      {/* SIDEBAR */}

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

      {/* EDITOR */}

      <Editor
        nodes={nodes}
        setNodes={setNodes}
        selectedId={selectedId}
        saveStatus={saveStatus}
      />
    </div>
  );
}