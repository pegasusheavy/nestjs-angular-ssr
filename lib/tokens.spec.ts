import { describe, expect, it } from 'vitest';
import { ANGULAR_SSR_OPTIONS, REQUEST, RESPONSE } from './tokens';

describe('Tokens', () => {
  describe('REQUEST', () => {
    it('should be a string token', () => {
      expect(typeof REQUEST).toBe('string');
    });

    it('should have the correct value', () => {
      expect(REQUEST).toBe('ANGULAR_SSR_REQUEST');
    });
  });

  describe('RESPONSE', () => {
    it('should be a string token', () => {
      expect(typeof RESPONSE).toBe('string');
    });

    it('should have the correct value', () => {
      expect(RESPONSE).toBe('ANGULAR_SSR_RESPONSE');
    });
  });

  describe('ANGULAR_SSR_OPTIONS', () => {
    it('should be a Symbol', () => {
      expect(typeof ANGULAR_SSR_OPTIONS).toBe('symbol');
    });

    it('should have descriptive symbol name', () => {
      expect(ANGULAR_SSR_OPTIONS.toString()).toBe('Symbol(ANGULAR_SSR_OPTIONS)');
    });
  });
});
