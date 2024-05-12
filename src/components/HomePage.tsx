import { Link } from "react-router-dom"

const HomePage = () => {
  return (
    <div>
      <div className="search-bar">
        <></>
      </div>
      <Link to="/document">New Document</Link>
      <div className="recent-documents">
        <></>
      </div>
    </div>
  )
}

export default HomePage