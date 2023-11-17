'use client';
import { useState, useEffect } from 'react';
import api from "@/services/api";

export default function Page() {
  const [tuites, setTuites] = useState([]);

  useEffect(() => {
    const fetchTuites = async () => {
      try {
        const response = await api.get('/tuites/');
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
          <li key={tuite.id_tuite}>{tuite.content}</li>
        ))}
      </ul>
    </div>
  );
}
