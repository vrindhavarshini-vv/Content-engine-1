import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

function ListExample() {
    const navigate = useNavigate()
    const handleNavigateToSettings = () => navigate("/user/setting");
    const handleNavigateToTemplates = () => navigate("/template");
    const handleNavigateToDashboard = () => navigate("/dashboard");
    const handleLogout =  (event) => {
        event.preventDefault();
        localStorage.removeItem("uid")
        navigate("/")
      };
  return (
    <div >
    <Nav className='navContainer' >
      <Nav.Item as="li">
         <button className='buttonInNav'   onClick={handleNavigateToDashboard}>Home</button>
    </Nav.Item>
      <Nav.Item as="li">
        <button className='buttonInNav'   onClick={handleNavigateToSettings}>Settings</button>
      </Nav.Item>
      <Nav.Item as="li">
        <button className='buttonInNav'   onClick={handleNavigateToTemplates}>Templates</button>
      </Nav.Item>
      <div className='navLogout'>
      <Nav.Item as="li">
        <button className='buttonInNav'   onClick={handleLogout}>Logout</button>
      </Nav.Item>
      </div>
    </Nav>
    </div>
  );
}

export default ListExample;