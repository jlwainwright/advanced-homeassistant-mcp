/**
 * Schema Conversion Utilities
 * 
 * Converts Zod schemas to JSON Schema format for MCP protocol compliance.
 * Uses zod-to-json-schema library for robust conversion that handles all Zod types.
 */

import { z } from 'zod';
import { zodToJsonSchema as zodToJsonSchemaLib } from 'zod-to-json-schema';
import type { JSONSchema7 } from 'json-schema';

/**
 * Convert a Zod schema to JSON Schema format for MCP tools
 * 
 * This function wraps zod-to-json-schema to ensure proper formatting
 * for MCP protocol compliance. The resulting schema is used in tool
 * definitions as the `inputSchema` field.
 * 
 * @param schema - Zod schema to convert
 * @param options - Optional conversion options
 * @returns JSON Schema object compatible with MCP protocol
 */
export function zodToJsonSchema(
  schema: z.ZodType<any> | undefined | null,
  options?: {
    target?: 'openApi3' | 'jsonSchema7' | 'jsonSchema2019-09';
    $refStrategy?: 'none' | 'seen' | 'root';
    definitionPath?: string;
    name?: string;
    description?: string;
  }
): JSONSchema7 {
  // Handle null/undefined schemas
  if (!schema) {
    return {
      type: 'object',
      properties: {},
      additionalProperties: false
    };
  }

  try {
    // Use zod-to-json-schema library for robust conversion
    const jsonSchema = zodToJsonSchemaLib(schema, {
      target: options?.target || 'jsonSchema7',
      $refStrategy: options?.$refStrategy || 'none',
      definitionPath: options?.definitionPath || '#/definitions',
      name: options?.name,
      ...options
    }) as JSONSchema7;

    // Ensure we always have a valid object schema
    if (!jsonSchema.type && !jsonSchema.anyOf && !jsonSchema.oneOf && !jsonSchema.allOf) {
      return {
        type: 'object',
        properties: jsonSchema.properties || {},
        required: jsonSchema.required || [],
        additionalProperties: jsonSchema.additionalProperties ?? false
      };
    }

    return jsonSchema;
  } catch (error) {
    // Fallback to basic object schema if conversion fails
    console.warn('Failed to convert Zod schema to JSON Schema:', error);
    return {
      type: 'object',
      properties: {},
      additionalProperties: false
    };
  }
}

/**
 * Convert a Zod schema to JSON Schema with MCP-specific formatting
 * 
 * This is a convenience function that ensures the schema is properly
 * formatted for MCP tool definitions, including proper handling of
 * optional fields and descriptions.
 * 
 * @param schema - Zod schema to convert
 * @returns JSON Schema formatted for MCP tools
 */
export function zodToMCPInputSchema(schema: z.ZodType<any> | undefined | null): JSONSchema7 {
  return zodToJsonSchema(schema, {
    target: 'jsonSchema7',
    $refStrategy: 'none'
  });
}

