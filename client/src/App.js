import React, { useEffect, useState } from 'react';

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 && <p>Loading...</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} - ${p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
