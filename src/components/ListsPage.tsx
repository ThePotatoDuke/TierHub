import React, { useEffect, useState } from "react";
import { TierListDTO } from "../Type";
import ListCard from "./ListCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

const fetchTierListsByUserId = async (userId: number) => {
  const response = await fetch(
    `http://localhost:8090/api/tier_lists/user/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch tier lists");
  }
  return response.json();
};

const ListsPage = () => {
  const [tierLists, setTierLists] = useState<TierListDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDesc, setNewListDesc] = useState("");

  const [newListImage, setNewListImage] = useState<File | null>(null);

  useEffect(() => {
    const userId = 1; // Replace with dynamic user ID if needed
    fetchTierListsByUserId(userId)
      .then((data) => {
        setTierLists(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err) => {
        setError("Failed to load tier lists");
        setLoading(false);
      });
  }, []);
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8090/api/tier_lists/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Remove the deleted tier list from state
      setTierLists(tierLists.filter((tierList) => tierList.id !== id));
    } catch (error) {
      console.error("Error deleting tier list:", error);
    }
  };

  const handleNewListClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewListTitle(event.target.value);
  };

  const handleDescripitonChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewListDesc(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewListImage(event.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newListTitle || !newListImage) {
      alert("Both title and image are required.");
      return;
    }

    try {
      // Upload image to the backend
      const formData = new FormData();
      formData.append("file", newListImage);

      const uploadResponse = await fetch(
        "http://localhost:8090/api/tier_lists/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.imageUrl;

      const tierListDTO = {
        name: newListTitle,
        imageUrl: imageUrl,
        userId: 1,
        description: newListDesc,
        categoryId: null,
      };

      const response = await fetch("http://localhost:8090/api/tier_lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tierListDTO),
      });

      if (!response.ok) {
        throw new Error("Failed to create new tier list");
      }

      const createdTierList = await response.json();
      setTierLists((prevTierLists) => [...prevTierLists, createdTierList]);
      handleCloseModal();
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating new tier list");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="p-4 flex flex-wrap gap-3">
        {tierLists.map((tierList) => (
          <div className=" ">
            <ListCard
              key={tierList.id}
              tierList={tierList}
              onDelete={handleDelete}
            />
          </div>
        ))}
        <div
          className="bg-slate-900 border-slate-800 border-4 border-dashed rounded-lg items-center justify-center cursor-pointer flex flex-col h-56 w-64"
          onClick={handleNewListClick}
        >
          <h3 className="text-lg font-bold text-white mb-2">New List</h3>
          <FontAwesomeIcon
            icon={faCirclePlus}
            className="text-white text-3xl"
          />
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl text-gray-600 font-bold mb-4">
              Create New List
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
                  onChange={handleDescripitonChange}
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
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListsPage;
