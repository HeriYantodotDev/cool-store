import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DirectoryItem from '../components/DirectoryItem/DirectoryItem.component';
import Directory from '../components/Directory/Directory.component';

import {
  defaultCTA,
  defaultCategories,
} from '../components/DirectoryItem/defaultValue';

const categoryListCustom = [
  { id: 1, title: 'John', imageUrl: 'adsf' },
  { id: 2, title: 'Doe', imageUrl: 'adsf' },
  { id: 3, title: 'Great', imageUrl: 'adsf' },
];

const ctaCustom = 'Shop Now';

describe('Directory Item Component', () => {
  const { title, imageUrl } = categoryListCustom[0];

  beforeEach(() => {
    render(
      <MemoryRouter>
        <DirectoryItem title={title} cta={ctaCustom} imageUrl={imageUrl} />
      </MemoryRouter>
    );
  });

  test('renders the title', () => {
    const titleElement = screen.getByText(title);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders the cta', () => {
    const craElement = screen.getByText(ctaCustom);
    expect(craElement).toBeInTheDocument();
  });

  // Find out how to be able to test background Image? So Far I can only test if the class is not null

  // test.only('renders the imageUrl', () => {
  //   const imageElement = screen.getByTestId('backgroundImage');
  //   expect(imageElement.classList).not.toBeNull();
  // });
});

describe('Categories Component With Argument', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Directory categoryList={categoryListCustom} cta={ctaCustom} />
      </MemoryRouter>
    );
  });

  test('renders the correct number of category when accepting argument', () => {
    const categoryElements = screen.getAllByTestId('category');
    expect(categoryElements.length).toBe(categoryListCustom.length);
  });

  test('renders the correct title name & cta when accepting argument', () => {
    const categoryElements = screen.getAllByTestId('category');
    categoryElements.forEach((category, index) => {
      expect(category).toHaveTextContent(categoryListCustom[index].title);
      expect(category).toHaveTextContent(ctaCustom);
    });
  });

  // test('renders the correct imageUrl when accepting argument', () => {
  //   const categoryElements = screen.getAllByTestId('category');
  //   categoryElements.forEach((category, index) => {
  //     const backgroundImage = within(category).getByTestId('backgroundImage');
  //     expect(backgroundImage).toHaveStyle(`backgroundImage: url(${categoryListCustom[index].imageUrl})`);
  //   });
  // });
});

describe('Categories Component Without Argument', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Directory />
      </MemoryRouter>
    );
  });

  test('renders the correct number of default category', () => {
    const categoryElements = screen.getAllByTestId('category');
    expect(categoryElements.length).toBe(defaultCategories.length);
  });

  test('renders the correct default title  & cta', () => {
    const categoryElements = screen.getAllByTestId('category');
    categoryElements.forEach((category, index) => {
      expect(category).toHaveTextContent(defaultCategories[index].title);
      expect(category).toHaveTextContent(defaultCTA);
    });
  });

  // test('renders the correct default imageUrl', () => {
  //   const categoryElements = screen.getAllByTestId('category');

  //   categoryElements.forEach((category, index) => {
  //     const backgroundImage = within(category).getByTestId('backgroundImage');
  //     expect(backgroundImage).toHaveStyle(`backgroundImage: url(${defaultCategories[index].imageUrl})`);
  //   });
  // });
});
