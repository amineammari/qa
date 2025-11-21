/**
 * Tests de composant pour Button
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button.jsx';

describe('Button Component', () => {
  it('devrait rendre le bouton avec le texte fourni', () => {
    render(<Button>Cliquer ici</Button>);
    expect(screen.getByText('Cliquer ici')).toBeInTheDocument();
  });

  it('devrait appeler onClick quand on clique', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Cliquer</Button>);
    
    fireEvent.click(screen.getByText('Cliquer'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<Button disabled>Bouton désactivé</Button>);
    const button = screen.getByText('Bouton désactivé');
    expect(button).toBeDisabled();
  });

  it('devrait ne pas appeler onClick quand désactivé', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Bouton désactivé
      </Button>
    );
    
    fireEvent.click(screen.getByText('Bouton désactivé'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('devrait appliquer la variante primary par défaut', () => {
    render(<Button>Bouton</Button>);
    const button = screen.getByText('Bouton');
    expect(button).toHaveClass('bg-blue-600');
  });

  it('devrait appliquer la variante secondary', () => {
    render(<Button variant="secondary">Bouton</Button>);
    const button = screen.getByText('Bouton');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('devrait appliquer la variante danger', () => {
    render(<Button variant="danger">Supprimer</Button>);
    const button = screen.getByText('Supprimer');
    expect(button).toHaveClass('bg-red-500');
  });

  it('devrait accepter le type submit', () => {
    render(<Button type="submit">Soumettre</Button>);
    const button = screen.getByText('Soumettre');
    expect(button).toHaveAttribute('type', 'submit');
  });
});

