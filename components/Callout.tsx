
import React from 'react';

interface CalloutProps {
  kind: 'note' | 'tip' | 'warning' | 'definition';
  content: string;
}

const kindMap = {
  note: {
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    icon: '💡',
    title: 'Note'
  },
  tip: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    icon: '👍',
    title: 'Tip'
  },
  warning: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    icon: '⚠️',
    title: 'Warning'
  },
  definition: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    icon: '📖',
    title: 'Definition'
  }
};

export const Callout: React.FC<CalloutProps> = ({ kind, content }) => {
  const { bgColor, borderColor, icon, title } = kindMap[kind];

  return (
    <div className={`my-6 p-4 border-l-4 rounded-r-lg ${bgColor} ${borderColor}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-gray-800">{title}</p>
          <p className="mt-1 text-sm text-gray-600">{content}</p>
        </div>
      </div>
    </div>
  );
};
