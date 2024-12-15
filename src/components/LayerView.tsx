import { useCallback } from 'react';
import ReactFlow, {
  Node,
  Controls,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import { useBlueprintStore } from '../store/blueprintStore';

interface LayerViewProps {
  nodeId: string;
  onClose: () => void;
}

export function LayerView({ nodeId, onClose }: LayerViewProps) {
  const { layers, updateLayer } = useBlueprintStore();
  const layer = layers[nodeId];

  const [nodes, setNodes, onNodesChange] = useNodesState(layer?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layer?.edges || []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      updateLayer(nodeId, nodes, newEdges);
    },
    [edges, nodes, nodeId, setEdges, updateLayer],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const newLabel = prompt('Enter new label:', node.data.label);
      if (newLabel) {
        const newNodes = nodes.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: { ...n.data, label: newLabel },
            };
          }
          return n;
        });
        setNodes(newNodes);
        updateLayer(nodeId, newNodes, edges);
      }
    },
    [nodes, edges, nodeId, setNodes, updateLayer],
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 bg-background border rounded-lg shadow-lg flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Layer View</h2>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md"
          >
            Close
          </button>
        </div>
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            fitView
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Background gap={15} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}