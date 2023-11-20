'use client';
import { useState, useEffect } from 'react';
import api from "@/services/api";
import Tuite from './components/Tuite';

export default function Page() {
  const [tuites, setTuites] = useState([]);

  useEffect(() => {
    const fetchTuites = async () => {
      try {
        const response = await api.get('/tuites/', {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        });
        setTuites(response.data);
      } catch (error) {
        console.error('Erro ao buscar tuites:', error);
      }
    };

    fetchTuites();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      <ul>
        {tuites.map(tuite => (
          <li key={tuite.id_tuite}>
            <Tuite
              profileimg={tuite.profileimg}
              username={tuite.username}
              content={tuite.content}
              firstname={tuite.firstname}
              lastname={tuite.lastname}
              createdA={tuite.createdAt}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
