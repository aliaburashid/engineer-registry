const React = require('react')
const Layout = require('../layouts/Layout')

function New(props) {
  return (
    <Layout>
      <h1>🛠️ Add New Engineer</h1>

      <form action={`/engineers?token=${props.token}`} method="POST">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            placeholder="Enter engineer's full name..."
            required 
          />
        </div>

        {/* Specialty */}
        <div className="form-group">
          <label htmlFor="specialty">Specialty:</label>
          <input 
            type="text" 
            id="specialty"
            name="specialty" 
            placeholder="e.g., Backend, Frontend, DevOps..."
            required 
          />
        </div>

        {/* Experience Checkbox */}
        <div className="form-group">
          <label>
            <input 
              type="checkbox"
              name="yearsExperience"
              value="1"
            />{' '}
            Has Experience
          </label>
        </div>

        {/* Form Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            ➕ Create Engineer
          </button>
          <a href={`/engineers?token=${props.token}`} className="btn btn-secondary">
            ← Back to All Engineers
          </a>
        </div>
      </form>
    </Layout>
  )
}

module.exports = New
