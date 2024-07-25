import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface NewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, image: File | null) => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    image: File | null
  ) => void;
  isEditing: boolean;
  currentList?: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
  };
}

const ListModal: React.FC<NewListModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  isEditing,
  currentList,
}) => {
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");
  const [newListImage, setNewListImage] = useState<File | null>(null);

  useEffect(() => {
    if (isEditing && currentList) {
      setNewListTitle(currentList.title);
      setNewListDesc(currentList.description);
      // Assume image will be updated if a new file is selected, otherwise retain the current image URL
    } else {
      setNewListTitle("");
      setNewListDesc("");
      setNewListImage(null);
    }
  }, [isEditing, currentList]);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewListTitle(event.target.value);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewListDesc(event.target.value);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewListImage(event.target.files[0]);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newListTitle || (!newListImage && !isEditing)) {
      alert("Title and image are required.");
      return;
    }

    if (isEditing && currentList) {
      onUpdate(currentList.id, newListTitle, newListDesc, newListImage);
    } else {
      onSubmit(newListTitle, newListDesc, newListImage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2 className="text-xl text-gray-600 font-bold mb-4">
          {isEditing ? "Edit List" : "Create New List"}
        </h2>

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={newListTitle}
              onChange={handleTitleChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={newListDesc}
              onChange={handleDescriptionChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-800"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-800"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full text-gray-800"
              required={!isEditing} // Required only if not editing
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md"
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListModal;
