/**
 * Tests for schema converter utility
 */

import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { zodToMCPInputSchema, zodToJsonSchema } from '../../mcp/utils/schema-converter.js';

describe('Schema Converter', () => {
  describe('zodToMCPInputSchema', () => {
    it('should convert a simple object schema', () => {
      const schema = z.object({
        name: z.string(),
        age: z.number()
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.type).toBe('object');
      expect(result.properties).toBeDefined();
      expect(result.properties?.name).toEqual({ type: 'string' });
      expect(result.properties?.age).toEqual({ type: 'number' });
      expect(result.required).toContain('name');
      expect(result.required).toContain('age');
    });

    it('should handle optional fields', () => {
      const schema = z.object({
        required: z.string(),
        optional: z.string().optional()
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.required).toContain('required');
      expect(result.required).not.toContain('optional');
    });

    it('should handle enums', () => {
      const schema = z.object({
        status: z.enum(['active', 'inactive', 'pending'])
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.properties?.status).toEqual({
        type: 'string',
        enum: ['active', 'inactive', 'pending']
      });
    });

    it('should handle arrays', () => {
      const schema = z.object({
        tags: z.array(z.string())
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.properties?.tags).toEqual({
        type: 'array',
        items: { type: 'string' }
      });
    });

    it('should handle nested objects', () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string()
        })
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.properties?.user).toBeDefined();
      expect(result.properties?.user.type).toBe('object');
    });

    it('should handle descriptions', () => {
      const schema = z.object({
        name: z.string().describe('User name'),
        age: z.number().describe('User age')
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.properties?.name.description).toBe('User name');
      expect(result.properties?.age.description).toBe('User age');
    });

    it('should return empty object schema for null/undefined', () => {
      const result1 = zodToMCPInputSchema(null);
      const result2 = zodToMCPInputSchema(undefined);

      expect(result1.type).toBe('object');
      expect(result1.properties).toEqual({});
      expect(result2.type).toBe('object');
      expect(result2.properties).toEqual({});
    });

    it('should handle tuples', () => {
      const schema = z.object({
        coordinates: z.tuple([z.number(), z.number()])
      });

      const result = zodToMCPInputSchema(schema);

      expect(result.properties?.coordinates).toBeDefined();
      expect(result.properties?.coordinates.type).toBe('array');
    });
  });

  describe('zodToJsonSchema', () => {
    it('should accept options parameter', () => {
      const schema = z.object({
        name: z.string()
      });

      const result = zodToJsonSchema(schema, {
        target: 'jsonSchema7'
      });

      expect(result.type).toBe('object');
      expect(result.properties).toBeDefined();
    });
  });
});

