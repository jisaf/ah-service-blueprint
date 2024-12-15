import { useCallback, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useBlueprintStore } from '../store/blueprintStore';
import { LayerView } from './LayerView';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Visits website' },
    position: { x: 100, y: 100 },
    className: 'bg-blue-100 rounded-md',
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Makes purchase' },
    position: { x: 400, y: 100 },
    className: 'bg-blue-100 rounded-md',
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    markerEnd: { type: MarkerType.ArrowClosed },
    type: 'smoothstep',
  },
];

export function Blueprint() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const { addLayer, layers } = useBlueprintStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      if (!layers[node.id]) {
        addLayer(node.id, [], []);
      }
    },
    [layers, addLayer],
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const newLabel = prompt('Enter new label:', node.data.label);
      if (newLabel) {
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: { ...n.data, label: newLabel },
              };
            }
            return n;
          }),
        );
      }
    },
    [setNodes],
  );

  return (
    <div className="w-full h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeClick={onNodeClick}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background gap={15} />
        <Controls />
      </ReactFlow>
      {selectedNode && (
        <LayerView
          nodeId={selectedNode.id}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}