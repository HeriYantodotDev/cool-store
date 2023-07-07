import {
  Fragment,
  useContext,
} from 'react';
import { Link, Outlet } from 'react-router-dom';

import './Navigation.styles.scss';
import { NavigationItem, NavigationProps } from '../../Types';

import { defaultNavigationArray } from './defaultValue';

import shopLogo from '../../assets/cool.png';

import { UserContext } from '../../context/user.context';

import { signOutUser } from '../../services/firebase/firebase.auth';

export function NavLink({
  path,
  label,
  onClick,
}: NavigationItem) {
  return (
    <li onClick={onClick} className='nav-item ml-5' data-testid='navlink'>
      <Link className='nav-link text-light' to={path}>
        {label}
      </Link>
    </li>

  );
}

export function Navigation({
  navigationArray = defaultNavigationArray,
}: NavigationProps) {

  const { currentUser } = useContext(UserContext);

  return (
    <Fragment>
      <nav className='navbar navbar-expand-lg navbar-light bg-dark mb-3' data-testid='navigation'>
        <Link to='/' className='navbar-brand' >
          <img className='logo rounded-circle' src={shopLogo} alt='shopLogo' data-testid='logo' width={70} />
          <span className='text-light ml-3 text-uppercase font-weight-bold '>Cool Store</span>
        </Link>

        <button className='navbar-toggler'
          type='button' data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul id='navBar' className='navbar-nav mr-auto'>
            {navigationArray.map(({ path, label }) => (
              <NavLink key={path} path={path} label={label} />
            ))}
          </ul>

          <ul id='authNavBar' className='navbar-nav ml-auto'>
            {
              currentUser ? (
                <NavLink onClick={signOutUser} key='signout' path='/' label='Sign Out' />
              ) : (
                <NavLink key='signin' path='auth' label='Sign In' />
              )
            }
          </ul>


        </div>
      </nav>

      <Outlet data-testid='outlet' />

    </Fragment>
  );
}