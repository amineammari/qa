/**
 * Tests de composant pour ProductCard
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard.jsx';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    description: 'Description du produit test',
    price: 29.99,
    image_url: null
  };

  it('devrait afficher le titre du produit', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('devrait afficher la description du produit', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Description du produit test')).toBeInTheDocument();
  });

  it('devrait afficher le prix du produit', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('29.99€')).toBeInTheDocument();
  });

  it('devrait afficher un lien vers les détails du produit', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    const link = screen.getByText('Voir détails');
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/product/1');
  });

  it('devrait afficher une image si image_url est fourni', () => {
    const productWithImage = {
      ...mockProduct,
      image_url: 'https://example.com/image.jpg'
    };
    renderWithRouter(<ProductCard product={productWithImage} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('devrait afficher un emoji si image_url n\'est pas fourni', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    expect(screen.getByText('📦')).toBeInTheDocument();
  });
});

