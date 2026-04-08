import React, { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout onAddClick={() => setShowModal(true)}>
      <Dashboard showModal={showModal} setShowModal={setShowModal} />
    </Layout>
  )
}

export default App
