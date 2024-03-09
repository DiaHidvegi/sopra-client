import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { api, handleError } from "helpers/api";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ProfilePage.scss";

interface UserProfile {
  id: string;
  username: string;
  birthday?: string;
  status?: string;
  creationDate?: string;
}

interface ProfileEditFormProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
}


// ProfileEditForm component for editing user details
const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ user, onSave }) => {
  const [username, setUsername] = useState(user.username);
  const [birthday, setBirthday] = useState(user.birthday || "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = user.id
    try {
      await api.put(`/users/${id}`, { id, username, birthday });
      onSave({ ...user, id, username, birthday }); 
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Birth Date:
        <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
      </label>
      <button type="submit">Save Changes</button>
    </form>
  );
}

const ProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  // const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false); // State to toggle editing mode
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      return <Navigate to="/register" />;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/users/${userId}`);
        setUser(response.data);
      } catch (error) {
        alert(`Could not fetch the user profile: \n${handleError(error)}`);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSave = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    setEditing(false); 
  };
  

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!localStorage.getItem("isLoggedIn")) {
    return <Navigate to="/register" />;
  }

  if (!user) return <div>Loading...</div>;

  return (
    <BaseContainer>
      <div className="profile container">
        <div className="profile card">
          <button onClick={handleBackClick}>Back</button>
          {!editing ? (
            <>
              <h2>User Profile</h2>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Status:</strong> {user.status}</p>
              <p><strong>Creation Date:</strong> {user.creationDate}</p>
              <p><strong>Birthday:</strong> {user.birthday || "Not set"}</p>
              <button onClick={handleEditClick}>Edit Profile</button>
            </>
          ) : (
            <ProfileEditForm user={user} onSave={handleSave} />
          )}
        </div>
      </div>
    </BaseContainer>
  );
};

export default ProfilePage;
