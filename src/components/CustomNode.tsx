import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PencilIcon } from 'lucide-react';

interface CustomNodeData {
  label: string;
  backgroundColor?: string;
}

function CustomNodeComponent({ data, isConnectable }: NodeProps<CustomNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [backgroundColor, setBackgroundColor] = useState(data.backgroundColor || 'rgb(219 234 254)'); // bg-blue-100

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
      if (e.key === 'Escape') {
        setLabel(data.label);
        setBackgroundColor(data.backgroundColor || 'rgb(219 234 254)');
      }
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </>
      )}
      <div
        className="px-4 py-2 rounded-md shadow-sm border border-gray-200"
        style={{ backgroundColor }}
      >
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border rounded px-2 py-1 text-sm"
              autoFocus
            />
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-6"
            />
          </div>
        ) : (
          <div className="relative">
            <span>{label}</span>
            {isHovered && (
              <button
                onClick={handleEditClick}
                className="absolute -right-2 -top-2 p-1 bg-white rounded-full shadow-sm border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <PencilIcon className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export const CustomNode = memo(CustomNodeComponent);