import React, { useState } from 'react';
import axios from 'axios';

interface User {
  name: { firstName: string; lastName: string };
  age: number;
  gender: string;
  interests: string[];
  languages?: string[];
}

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const response = await axios.post('http://localhost:5000/api/filter', { query });
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching filtered users:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFullName = (name: { firstName: string; lastName: string }) =>
    `${name.firstName} ${name.lastName}`;

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">🧠 AI-Powered Matrimony Search</h1>

      <div className="mb-3">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="form-control"
          rows={3}
          placeholder="Type anything like: 'Looking for a woman over 20 who speaks German and loves cooking'"
        />
        <button onClick={handleSearch} className="btn btn-primary mt-2" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {query && (
        <div className="alert alert-info">
          <strong>You:</strong> {query}
        </div>
      )}

      {results.length > 0 && (
        <div className="alert alert-success">
          ✅ {results.length} match{results.length > 1 ? 'es' : ''} found.
        </div>
      )}

      {!loading && results.length === 0 && query && (
        <div className="text-muted">No results found.</div>
      )}

      {loading && <p className="text-muted">Please wait, searching with AI...</p>}

      {results.length > 0 && (
        <table className="table table-bordered mt-3">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Interests</th>
              <th>Languages</th>
            </tr>
          </thead>
          <tbody>
            {results.map((user, index) => (
              <tr key={index}>
                <td>{getFullName(user.name)}</td>
                <td>{user.age}</td>
                <td>{user.gender}</td>
                <td>{user.interests?.join(', ')}</td>
                <td>{user.languages?.join(', ') || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default App;
