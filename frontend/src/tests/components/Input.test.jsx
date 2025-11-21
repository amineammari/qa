/**
 * Tests de composant pour Input
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/Input.jsx';

describe('Input Component', () => {
  it('devrait rendre un input avec le type fourni', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('devrait afficher le placeholder', () => {
    render(<Input placeholder="Entrez votre email" />);
    expect(screen.getByPlaceholderText('Entrez votre email')).toBeInTheDocument();
  });

  it('devrait mettre à jour la valeur quand on tape', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input).toHaveValue('test@example.com');
  });

  it('devrait appeler onChange quand la valeur change', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'nouvelle valeur' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('devrait être désactivé quand disabled est true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('devrait afficher une erreur si error est fourni', () => {
    render(<Input error="Ce champ est requis" />);
    expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
  });

  it('devrait appliquer les classes d\'erreur quand error est présent', () => {
    render(<Input error="Erreur" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });
});

