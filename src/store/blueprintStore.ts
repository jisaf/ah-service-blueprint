import { create } from 'zustand';
import { Node, Edge } from 'reactflow';

interface BlueprintState {
  nodes: Node[];
  edges: Edge[];
  layers: Record<string, { nodes: Node[]; edges: Edge[] }>;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addLayer: (nodeId: string, nodes: Node[], edges: Edge[]) => void;
  updateLayer: (nodeId: string, nodes: Node[], edges: Edge[]) => void;
}

export const useBlueprintStore = create<BlueprintState>((set) => ({
  nodes: [],
  edges: [],
  layers: {},
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addLayer: (nodeId, nodes, edges) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [nodeId]: { nodes, edges },
      },
    })),
  updateLayer: (nodeId, nodes, edges) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [nodeId]: { nodes, edges },
      },
    })),
}));