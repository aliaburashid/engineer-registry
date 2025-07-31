const React = require('react')
const Layout = require('../layouts/Layout')

function Show(props) {
  const engineer = props.engineer

  return (
    <Layout engineer={engineer}>
      <h1>🛠️ {engineer.name}</h1>

      <div className="engineer-card">
        <div className="engineer-name">Name: {engineer.name}</div>
        <div className="engineer-specialty">Specialty: {engineer.specialty}</div>
        <div className="engineer-experience">
          Experience:{' '}
          {engineer.experience === 0
            ? 'No experience'
            : `${engineer.experience} year${engineer.experience > 1 ? 's' : ''}`}
        </div>

        <p className="mb-3">
          {engineer.name} specializes in <strong>{engineer.specialty}</strong> and has
          <strong>
            {engineer.experience === 0
              ? ' no experience'
              : ` ${engineer.experience} year${engineer.experience > 1 ? 's' : ''} of experience`}
          </strong>.
        </p>

        <div className="d-flex gap-2">
          <a href={`/engineers?token=${props.token}`} className="btn btn-secondary">
            ← Back to All Engineers
          </a>
          <a href={`/engineers/${engineer._id}/edit?token=${props.token}`} className="btn btn-primary">
            ✏️ Edit {engineer.name}
          </a>
        </div>

        <div className="mt-3">
          <form action={`/engineers/${engineer._id}?_method=DELETE&token=${props.token}`} method="POST">
            <button type="submit" className="btn btn-danger">
              🗑️ Delete {engineer.name}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}

module.exports = Show
