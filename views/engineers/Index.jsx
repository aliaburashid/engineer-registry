const React = require('react')
const Layout = require('../layouts/Layout')

function Index(props) {
  const engineers = props.engineers

  return (
    <Layout>
      <h1>🛠️ All Engineers</h1>

      <div className="d-flex justify-between align-center mb-3">
        <h2>Your Engineers</h2>
        <a href={`/engineers/new?token=${props.token}`} className="btn btn-primary">
          ➕ Add New Engineer
        </a>
      </div>

      {engineers.length === 0 ? (
        <div className="text-center">
          <p>No engineers added yet! Add your first engineer to get started.</p>
          <a href={`/engineers/new?token=${props.token}`} className="btn btn-primary">
            Add Your First Engineer
          </a>
        </div>
      ) : (
        <div className="engineers-grid">
          {engineers.map((engineer) => (
            <div key={engineer._id} className="engineer-card">
              <div className="engineer-name">{engineer.name}</div>
              <div className="engineer-specialty">Specialty: {engineer.specialty}</div>
              <div className="engineer-experience">Experience: {engineer.experience} years</div>
              <div className="d-flex gap-2">
                <a href={`/engineers/${engineer._id}?token=${props.token}`} className="btn btn-secondary">
                  👁️ View
                </a>
                <a href={`/engineers/${engineer._id}/edit?token=${props.token}`} className="btn btn-primary">
                  ✏️ Edit
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}

module.exports = Index
