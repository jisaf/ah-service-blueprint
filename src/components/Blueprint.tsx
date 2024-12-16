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
import { CustomNode } from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Visits website' },
    position: { x: 100, y: 100 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Makes purchase' },
    position: { x: 400, y: 100 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'right',
    targetHandle: 'left',
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

  const onPaneDoubleClick = useCallback(
    (event: React.MouseEvent) => {
      // Get the position from the event, relative to the viewport
      const bounds = (event.target as HTMLElement).getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      // Create a new node
      const newNode: Node = {
        id: `node-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: { label: 'New Node' },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes],
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
        onDoubleClick={onPaneDoubleClick}
        nodeTypes={nodeTypes}
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