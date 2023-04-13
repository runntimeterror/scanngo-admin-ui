import { useState, useEffect } from "react";

function DashboardPage() {
    const [username, setUsername] = useState('');
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          setUsername(decodedToken.username);
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }, []);
  
    function handleLogout() {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  
    return (
      <div>
        <h1>Welcome, {username}!</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  }
  
  export default DashboardPage