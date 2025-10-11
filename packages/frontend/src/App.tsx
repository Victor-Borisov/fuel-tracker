import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <header>
          <h1>Fuel Tracker</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<h2>Welcome to Fuel Tracker</h2>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
