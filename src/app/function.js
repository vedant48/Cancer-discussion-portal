import { httpsCallable } from 'firebase/functions';
import { useState, useEffect } from 'react';
import { getFunctions } from 'firebase/functions';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const listUsers = httpsCallable(getFunctions(), 'listUsers');
      const { data } = await listUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  console.log(users);

  return (
    <div>
      {users.map((user) => (
        <div key={user.uid}>
          <p>User ID: {user.uid}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UserList;
