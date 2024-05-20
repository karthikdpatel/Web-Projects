
import {Nav, Navbar, Container} from 'react-bootstrap';
import './App.css';
import {NavLink} from "react-router-dom";


function App() {
    return (
      <Navbar style={{ backgroundColor: '#1d279d' }} variant='dark'>
        <Container fluid className='px-0'>
          <Navbar.Brand className='ms-5' >Stock Search</Navbar.Brand>
          <Nav className='me-5'>
            <NavLink to='/' className={(isActive : boolean) => "search-box" + (!isActive ? " unselected" : "")}>Search</NavLink>
            <NavLink to='/watchlist' className={(isActive : boolean) => "search-box" + (!isActive ? " unselected" : "")} >Watchlist</NavLink>
            <NavLink to='/portfolio' className={(isActive : boolean) => "search-box" + (!isActive ? " unselected" : "")}>Portfolio</NavLink>
          </Nav>
        </Container>
      </Navbar>
  );
}

export default App;
