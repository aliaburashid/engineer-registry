const React = require('react')

function Layout(props) {
  return (
    <html>
      <head>
        {/* Dynamic page title: if engineer exists, show their name, else show default */}
        <title>
          {!props.engineer?.name
            ? 'Engineers App - The Greatest Of All Time'
            : `${props.engineer.name} - Engineers App`}
        </title>
        
        <link rel="stylesheet" href="/styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body>
        <div className="container">
          {/* Render whatever content is inside this layout */}
          {props.children}
        </div>
      </body>
    </html>
  )
}

module.exports = Layout
