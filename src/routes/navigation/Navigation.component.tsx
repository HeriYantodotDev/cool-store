/* eslint-disable react/jsx-no-bind */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Link, Outlet } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { NavigationItem, NavigationProps } from '../../Types';

import { defaultNavigationArray } from './defaultValue';

import shopLogo from '../../assets/loud.jpg';

import {
  selectCartCount,
  selectIsCartOpen,
} from '../../store/cart/cart.selector';

import { signOutUser } from '../../services/firebase/firebase.auth';

import CartIcon from '../../components/CartIcon/CartIcon.component';
import CartDropDown from '../../components/CartDropDown/CartDropDown.component';

import {
  NavigationContainer,
  LinkContainer,
  Logocontainer,
  LogoText,
} from './Navigation.styles';

import { selectCurrentUser } from '../../store/user/user.selector';
import { setIsCartOpen } from '../../store/cart/cart.action';

const brandName = 'Cool Store';

export function NavLink({ path, label, onClick }: NavigationItem) {
  return (
    <li onClick={onClick} className="nav-item ml-5" data-testid="navlink">
      <Link className="nav-link text-light" to={path}>
        {label}
      </Link>
    </li>
  );
}

export default function Navigation({
  navigationArray = defaultNavigationArray,
}: NavigationProps) {
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);
  const countItems = useSelector(selectCartCount);
  const dispatch = useDispatch();

  function handleCartIconClick() {
    dispatch(setIsCartOpen(!isCartOpen));
  }

  return (
    <>
      <NavigationContainer data-testid="navigation">
        <LinkContainer to="/">
          <Logocontainer src={shopLogo} alt="shopLogo" data-testid="logo" />
          <LogoText>{brandName}</LogoText>
        </LinkContainer>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul id="navBar" className="navbar-nav mr-auto" data-testid="navGroup">
            {navigationArray.map(({ path, label }) => (
              <NavLink key={path} path={path} label={label} />
            ))}
          </ul>

          <ul
            id="authNavBar"
            className="navbar-nav ml-auto"
            data-testid="authNavGroup"
          >
            {currentUser ? (
              <NavLink
                onClick={signOutUser}
                key="signout"
                path="/"
                label="Sign Out"
              />
            ) : (
              <NavLink key="signin" path="auth" label="Sign In" />
            )}
            <CartIcon onClick={handleCartIconClick} countItems={countItems} />
          </ul>
          {isCartOpen && <CartDropDown />}
        </div>
      </NavigationContainer>

      <Outlet data-testid="outlet" />
    </>
  );
}
