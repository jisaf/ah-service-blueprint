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
import { CustomNode } from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

interface LayerViewProps {
  nodeId: string;
  onClose: () => void;
}

export function LayerView({ nodeId, onClose }: LayerViewProps) {
  const { layers, updateLayer } = useBlueprintStore();
  const layer = layers[nodeId];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    layer?.nodes?.map(node => ({ ...node, type: 'custom' })) || []
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(layer?.edges || []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      updateLayer(nodeId, nodes, newEdges);
    },
    [edges, nodes, nodeId, setEdges, updateLayer],
  );

  const [lastClickTime, setLastClickTime] = useState(0);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastClickTime;
      
      if (timeDiff < 300) { // Double click threshold
        const bounds = (event.target as HTMLElement).getBoundingClientRect();
        const position = {
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        };

        const newNode: Node = {
          id: `node-${nodeId}-${nodes.length + 1}`,
          type: 'custom',
          position,
          data: { label: 'New Node' },
        };

        const newNodes = [...nodes, newNode];
        setNodes(newNodes);
        updateLayer(nodeId, newNodes, edges);
      }
      
      setLastClickTime(currentTime);
    },
    [lastClickTime, nodes, nodeId, edges, setNodes, updateLayer],
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
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
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