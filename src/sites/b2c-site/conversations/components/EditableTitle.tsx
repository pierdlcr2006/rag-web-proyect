import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationsApi } from '../api/conversations.api';

interface Props {
  id: string;
  initialTitle: string;
}

export const EditableTitle: React.FC<Props> = ({ id, initialTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const queryClient = useQueryClient();

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const mutation = useMutation({
    mutationFn: (newTitle: string) => conversationsApi.update(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', id] });
      setIsEditing(false);
    },
  });

  const handleBlur = () => {
    if (title !== initialTitle) {
      mutation.mutate(title);
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        autoFocus
        type="text"
        className="text-xl font-bold bg-transparent border-b border-primary outline-none w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <h1
      onDoubleClick={() => setIsEditing(true)}
      className="text-xl font-bold cursor-pointer hover:text-primary transition-colors"
    >
      {title}
    </h1>
  );
};
