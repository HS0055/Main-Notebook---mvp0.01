import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface EditableElement {
  id: string;
  type: 'text' | 'textarea' | 'checkbox' | 'date' | 'number' | 'select';
  x: number;
  y: number;
  width: number;
  height: number;
  placeholder?: string;
  options?: string[];
  defaultValue?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    border?: string;
  };
}

interface EditableLayoutProps {
  svgData: string;
  editableElements: EditableElement[];
  onElementChange: (elementId: string, value: string) => void;
  onLayoutSave: (layoutData: any) => void;
  className?: string;
}

export default function EditableLayout({
  svgData,
  editableElements,
  onElementChange,
  onLayoutSave,
  className = ''
}: EditableLayoutProps) {
  const [elementValues, setElementValues] = useState<Record<string, string>>({});
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize element values
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    editableElements.forEach(element => {
      initialValues[element.id] = element.defaultValue || '';
    });
    setElementValues(initialValues);
  }, [editableElements]);

  const handleElementClick = (elementId: string) => {
    setActiveElement(elementId);
    setIsEditing(true);
  };

  const handleElementChange = (elementId: string, value: string) => {
    setElementValues(prev => ({ ...prev, [elementId]: value }));
    onElementChange(elementId, value);
  };

  const handleElementBlur = () => {
    setActiveElement(null);
    setIsEditing(false);
  };

  const handleSaveLayout = () => {
    const layoutData = {
      svgData,
      editableElements,
      elementValues,
      timestamp: new Date().toISOString()
    };
    onLayoutSave(layoutData);
  };

  const renderEditableElement = (element: EditableElement) => {
    const value = elementValues[element.id] || '';
    const isActive = activeElement === element.id;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      fontSize: element.style?.fontSize || 14,
      fontFamily: element.style?.fontFamily || 'inherit',
      color: element.style?.color || '#333',
      backgroundColor: element.style?.backgroundColor || 'transparent',
      border: element.style?.border || (isActive ? '2px solid #3B82F6' : '1px solid #E5E5E5'),
      borderRadius: '4px',
      padding: '4px 8px',
      outline: 'none',
      transition: 'all 0.2s ease',
      zIndex: isActive ? 10 : 1,
      ...(isActive && {
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        transform: 'scale(1.02)'
      })
    };

    switch (element.type) {
      case 'text':
        return (
          <input
            key={element.id}
            type="text"
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            onFocus={() => setActiveElement(element.id)}
            onBlur={handleElementBlur}
            style={baseStyle}
            className="editable-element"
          />
        );

      case 'textarea':
        return (
          <textarea
            key={element.id}
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            onFocus={() => setActiveElement(element.id)}
            onBlur={handleElementBlur}
            style={{
              ...baseStyle,
              resize: 'none',
              fontFamily: 'inherit'
            }}
            className="editable-element"
          />
        );

      case 'checkbox':
        return (
          <div
            key={element.id}
            style={baseStyle}
            className="editable-element flex items-center justify-center cursor-pointer"
            onClick={() => handleElementChange(element.id, value === 'true' ? 'false' : 'true')}
          >
            <input
              type="checkbox"
              checked={value === 'true'}
              onChange={() => {}} // Handled by parent div
              style={{ margin: 0 }}
            />
          </div>
        );

      case 'date':
        return (
          <input
            key={element.id}
            type="date"
            value={value}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            onFocus={() => setActiveElement(element.id)}
            onBlur={handleElementBlur}
            style={baseStyle}
            className="editable-element"
          />
        );

      case 'number':
        return (
          <input
            key={element.id}
            type="number"
            value={value}
            placeholder={element.placeholder}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            onFocus={() => setActiveElement(element.id)}
            onBlur={handleElementBlur}
            style={baseStyle}
            className="editable-element"
          />
        );

      case 'select':
        return (
          <select
            key={element.id}
            value={value}
            onChange={(e) => handleElementChange(element.id, e.target.value)}
            onFocus={() => setActiveElement(element.id)}
            onBlur={handleElementBlur}
            style={baseStyle}
            className="editable-element"
          >
            <option value="">Select...</option>
            {element.options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* SVG Background */}
      <div className="relative w-full h-full">
        <img
          src={svgData}
          alt="Layout Template"
          className="w-full h-auto"
          style={{ pointerEvents: 'none' }}
        />
        
        {/* Editable Elements Overlay */}
        <div className="absolute inset-0">
          {editableElements.map(renderEditableElement)}
        </div>
      </div>

      {/* Save Button */}
      <motion.button
        onClick={handleSaveLayout}
        className="absolute top-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Layout
      </motion.button>

      {/* Element Info Panel */}
      {activeElement && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border max-w-xs"
        >
          <h4 className="font-medium text-gray-900 mb-2">
            {editableElements.find(e => e.id === activeElement)?.type || 'Element'}
          </h4>
          <p className="text-sm text-gray-600">
            {editableElements.find(e => e.id === activeElement)?.placeholder || 'Edit this element'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
