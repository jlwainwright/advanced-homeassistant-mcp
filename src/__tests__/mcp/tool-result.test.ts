/**
 * Tests for tool result formatting utilities
 */

import { describe, it, expect } from '@jest/globals';
import { formatToolResult, isErrorResult } from '../../mcp/utils/tool-result.js';

describe('Tool Result Utilities', () => {
  describe('formatToolResult', () => {
    it('should format string results', () => {
      const result = formatToolResult('Hello world');
      
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      expect(result.content[0].text).toBe('Hello world');
      expect(result.isError).toBe(false);
    });

    it('should format number results', () => {
      const result = formatToolResult(42);
      
      expect(result.content[0].text).toBe('42');
      expect(result.isError).toBe(false);
    });

    it('should format boolean results', () => {
      const result = formatToolResult(true);
      
      expect(result.content[0].text).toBe('true');
      expect(result.isError).toBe(false);
    });

    it('should format object results', () => {
      const obj = { data: 'test', count: 5 };
      const result = formatToolResult(obj);
      
      expect(result.content[0].text).toContain('data');
      expect(result.content[0].text).toContain('test');
      expect(result.isError).toBe(false);
    });

    it('should handle success/message pattern', () => {
      const result1 = formatToolResult({ success: true, message: 'Success' });
      const result2 = formatToolResult({ success: false, message: 'Failed' });
      
      expect(result1.content[0].text).toBe('Success');
      expect(result1.isError).toBe(false);
      expect(result2.content[0].text).toBe('Failed');
      expect(result2.isError).toBe(true);
    });

    it('should handle error objects', () => {
      const result = formatToolResult({ error: 'Something went wrong' });
      
      expect(result.content[0].text).toContain('Something went wrong');
      expect(result.isError).toBe(true);
    });

    it('should handle Error instances', () => {
      const error = new Error('Test error');
      const result = formatToolResult(error);
      
      expect(result.content[0].text).toBe('Test error');
      expect(result.isError).toBe(true);
    });

    it('should handle null/undefined', () => {
      const result1 = formatToolResult(null);
      const result2 = formatToolResult(undefined);
      
      expect(result1.content[0].text).toBe('');
      expect(result2.content[0].text).toBe('');
    });

    it('should preserve MCP format if already formatted', () => {
      const mcpResult = {
        content: [{ type: 'text', text: 'Already formatted' }],
        isError: false
      };
      
      const result = formatToolResult(mcpResult);
      
      expect(result.content).toEqual(mcpResult.content);
      expect(result.isError).toBe(false);
    });

    it('should respect isError parameter', () => {
      const result = formatToolResult('Test', true);
      
      expect(result.isError).toBe(true);
    });
  });

  describe('isErrorResult', () => {
    it('should detect error results', () => {
      expect(isErrorResult({ isError: true })).toBe(true);
      expect(isErrorResult({ success: false })).toBe(true);
      expect(isErrorResult({ error: 'message' })).toBe(true);
      expect(isErrorResult(new Error('test'))).toBe(true);
    });

    it('should detect non-error results', () => {
      expect(isErrorResult({ success: true })).toBe(false);
      expect(isErrorResult({ message: 'ok' })).toBe(false);
      expect(isErrorResult('string')).toBe(false);
      expect(isErrorResult(null)).toBe(false);
    });
  });
});

