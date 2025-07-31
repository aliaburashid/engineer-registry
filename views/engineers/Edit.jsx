const React = require('react')
const Layout = require('../layouts/Layout')

function Edit(props) {
  const { name, _id, specialty, yearsExperience } = props.engineer

  return (
    <Layout engineer={props.engineer}>
      <h1>✏️ Edit {name}</h1>

      <form action={`/engineers/${_id}?_method=PUT&token=${props.token}`} method="POST">
        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            defaultValue={name}
            placeholder="Enter full name..."
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
            defaultValue={specialty}
            placeholder="e.g., Backend, Frontend..."
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
              defaultChecked={yearsExperience > 0}
            />{' '}
            Has Experience
          </label>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            💾 Update Engineer
          </button>
          <a href={`/engineers/${_id}?token=${props.token}`} className="btn btn-secondary">
            ← Back to {name}
          </a>
        </div>
      </form>
    </Layout>
  )
}

module.exports = Edit
